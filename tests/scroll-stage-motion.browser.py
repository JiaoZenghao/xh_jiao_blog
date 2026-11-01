"""Live regression: python tests/scroll-stage-motion.browser.py (dev server + tt-scroll)."""
import subprocess,json,time

def cli(*args):
    r=subprocess.run(['browser-use','--session','tt-scroll',*args],capture_output=True,text=True,check=True)
    return r.stdout.strip()
def ev(js):
    out=cli('eval',js)
    if 'result: ' in out:
        value=out.split('result: ',1)[1]
        if value in ('True', 'False'): return value == 'True'
        try: return json.loads(value)
        except ValueError: return value
    return out

def snapshot():
    return ev("JSON.stringify([...document.querySelectorAll('.stage-card,.stage-caption,[data-scroll-stage] .motion-ring,[data-scroll-stage] .motion-orbit,[data-scroll-stage] .motion-grid,[data-scroll-stage] .motion-cell,.stage-meter span')].map(x=>[getComputedStyle(x).opacity,getComputedStyle(x).transform,getComputedStyle(x).borderRadius]))")
def seek(p):
    ev(f"(()=>{{let r=document.querySelector('[data-scroll-stage]'),panel=r.querySelector('.stage-panel');window.scrollTo({{top:r.getBoundingClientRect().top+scrollY+(r.offsetHeight-panel.offsetHeight)*{p},behavior:'instant'}})}})()")

def verify():
    cli('open','http://localhost:4321/xh_jiao_blog/')
    ev("document.documentElement.dataset.theme='dark'")
    assert ev("document.querySelector('[data-scroll-stage]').classList.contains('is-enhanced')") is True
    forward={}
    for p in [0,.15,.35,.5,.7,.8,1]:
        seek(p); forward[p]=snapshot()
    for p in [1,.8,.7,.5,.35,.15,0]:
        seek(p); actual=snapshot()
        assert actual==forward[p],f'non-deterministic state at {p}:\nforward:{forward[p]}\nreverse:{actual}'
    assert ev("document.documentElement.scrollWidth<=innerWidth") is True
    print('PASS forward/reverse equality at 7 positions; no horizontal overflow')


# Optional full matrix runner below uses only the existing browser-use/CDP session.
def cdp(method, params):
    cli('python', 'import asyncio; '
        's=asyncio.run_coroutine_threadsafe(browser._session.get_or_create_cdp_session(), browser._loop).result(); '
        f'asyncio.run_coroutine_threadsafe(s.cdp_client.send.Emulation.{method}(params={params!r}, '
        'session_id=s.session_id), browser._loop).result()')


def fits():
    assert ev("""(()=>{const r=document.querySelector('[data-scroll-stage]');
      const box=s=>r.querySelector(s).getBoundingClientRect();
      const art=box('.motion-art'), arena=box('.stage-arena'), cards=box('.stage-cards'), status=box('.stage-status');
      return art.width>0&&Math.abs(art.width-art.height)<1&&art.left>=arena.left-1&&art.right<=arena.right+1
        &&art.top>=arena.top-1&&art.bottom<=cards.top+1&&cards.bottom<=status.top+1
        &&status.bottom<=innerHeight+1&&document.documentElement.scrollWidth<=innerWidth})()"""), 'shared square overlaps or overflows'


def matrix():
    original = ev('JSON.stringify({width:innerWidth,height:innerHeight,deviceScaleFactor:devicePixelRatio,mobile:false})')
    try:
        cdp('setEmulatedMedia', {'features': [{'name': 'prefers-reduced-motion', 'value': 'no-preference'}]})
        for width, height in [(1440, 1000), (1440, 700), (390, 844), (390, 700)]:
            cdp('setDeviceMetricsOverride', {**original, 'width': width, 'height': height})
            verify()
            assert ev("document.querySelectorAll('[data-scroll-stage] .motion-cell').length===121&&!document.querySelector('[data-scroll-stage] button,.stage-shape')")
            # Pause Hero explicitly, then ensure stage seeks cannot write its targets.
            ev("(()=>{const b=document.querySelector('[data-motion-scene][data-driver=auto] [data-motion-pause]');if(b.getAttribute('aria-pressed')==='false')b.click();return true})()")
            hero = ev("JSON.stringify([...document.querySelectorAll('[data-motion-scene][data-driver=auto][data-variant=orbit] .motion-art *')].map(x=>x.getAttribute('style')))")
            for progress in [0, .5, 1]:
                seek(progress)
                fits()
            assert hero == ev("JSON.stringify([...document.querySelectorAll('[data-motion-scene][data-driver=auto][data-variant=orbit] .motion-art *')].map(x=>x.getAttribute('style')))")
            for theme in ['dark', 'light']:
                ev(f"document.documentElement.dataset.theme='{theme}'")
                seek(.5)
                fits()
                cli('screenshot', f'/tmp/tt-scroll-{width}-{height}-{theme}.png')
        # Hero and signal retain independently functional controls and motion.
        for variant in ['orbit', 'signal']:
            scene = f'[data-motion-scene][data-driver=auto][data-variant={variant}]'
            ev(f"document.querySelector('{scene}').scrollIntoView({{block:'center',behavior:'instant'}});true")
            ev(f"document.querySelector('{scene} [data-motion-replay]').click();true")
            assert ev(f"document.querySelector('{scene} [data-motion-pause]').getAttribute('aria-pressed')==='false'")
            selector = '.motion-ring--outer' if variant == 'orbit' else '.signal-cursor'
            before = ev(f"document.querySelector('{scene} {selector}').getAttribute('style')")
            time.sleep(.2)
            assert before != ev(f"document.querySelector('{scene} {selector}').getAttribute('style')"), f'{variant} did not resume'
            ev(f"document.querySelector('{scene} [data-motion-pause]').click();true")
            before = ev(f"document.querySelector('{scene} {selector}').getAttribute('style')")
            time.sleep(.2)
            assert before == ev(f"document.querySelector('{scene} {selector}').getAttribute('style')"), f'{variant} did not pause'
        assert ev("['#introduction','#hobby','#hero'].every(s=>document.querySelector(s))")
        # Reload without scripts: no long track and every static card stays visible.
        cdp('setScriptExecutionDisabled', {'value': True})
        cli('open', 'http://localhost:4321/xh_jiao_blog/')
        assert ev("!document.querySelector('[data-scroll-stage]').classList.contains('is-enhanced')&&[...document.querySelectorAll('.stage-card')].every(x=>getComputedStyle(x).opacity==='1')")
        print('PASS viewport/theme geometry, Hero isolation and controls, signal playback, anchors, no-JS static cards')
    finally:
        cdp('setScriptExecutionDisabled', {'value': False})
        cdp('setDeviceMetricsOverride', original)
        cdp('setEmulatedMedia', {'features': [{'name': 'prefers-reduced-motion', 'value': 'no-preference'}]})
        cli('open', 'http://localhost:4321/xh_jiao_blog/')


if __name__ == '__main__':
    matrix()
