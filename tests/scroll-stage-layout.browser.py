"""Live-browser regression. Requires dev server and browser-use session tt-scroll.
Run: python tests/scroll-stage-layout.browser.py
Uses CDP only for media/viewport emulation; restores both in finally.
"""
import json
import subprocess


def cli(*args):
    return subprocess.run(['browser-use', '--session', 'tt-scroll', *args], check=True,
                          capture_output=True, text=True).stdout.strip()


def ev(js):
    value = cli('eval', js).split('result: ', 1)[1]
    if value in ('True', 'False'):
        return value == 'True'
    return json.loads(value)


def cdp(method, params):
    cli('python', 'import asyncio; '
        's=asyncio.run_coroutine_threadsafe(browser._session.get_or_create_cdp_session(), browser._loop).result(); '
        f'asyncio.run_coroutine_threadsafe(s.cdp_client.send.Emulation.{method}(params={params!r}, '
        'session_id=s.session_id), browser._loop).result()')


def media(value):
    cdp('setEmulatedMedia', {'features': [{'name': 'prefers-reduced-motion', 'value': value}]})


def snapshot():
    return ev("JSON.stringify([...document.querySelectorAll('main > section,.fact-card,.hobby__card,.section-copy,.profile-panel')].map(x=>[x.style.transform,x.style.opacity,x.style.getPropertyValue('--section-progress')]))")


def check(enhanced):
    assert ev("document.querySelector('[data-scroll-stage]').classList.contains('is-enhanced')") == enhanced
    # Compare actual current-position geometry, not stale cached offsets.
    assert ev("""(()=>{const el=document.querySelector('#introduction');let top=0;for(let p=el;p;p=p.offsetParent)top+=p.offsetTop;
      const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
      const expected=reduced?1:Math.min(1,Math.max(0,(scrollY+innerHeight-top)/(innerHeight+el.offsetHeight)));
      return Math.abs(Number(el.style.getPropertyValue('--section-progress'))-expected)<1e-9})()""")
    before = snapshot()
    ev("window.dispatchEvent(new Event('resize')); true")
    assert snapshot() == before, 'forced remeasure changed downstream state: cached geometry was stale'
    if not enhanced:
        assert ev("[...document.querySelectorAll('.stage-card,.stage-caption,[data-scroll-stage] .motion-ring,[data-scroll-stage] .motion-orbit,[data-scroll-stage] .motion-grid,[data-scroll-stage] .motion-cell')].every(x=>!x.style.transform&&!x.style.opacity&&!x.style.borderRadius)"), 'static reversion retained inline styles'
    events = ev('window.stageLayoutEvents')
    # Several separate CLI evaluations allow observer frames to settle.
    snapshot()
    snapshot()
    assert ev('window.stageLayoutEvents') == events, 'layout notification loop'


cli('open', 'http://localhost:4321/xh_jiao_blog/')
original = ev('JSON.stringify({width:innerWidth,height:innerHeight,deviceScaleFactor:devicePixelRatio,mobile:false})')
try:
    media('reduce')
    ev("window.stageLayoutEvents=0;document.addEventListener('scroll-stage:layout',()=>window.stageLayoutEvents++);window.scrollTo({top:document.querySelector('#introduction').getBoundingClientRect().top+scrollY-innerHeight*.4,behavior:'instant'});true")
    check(False)
    media('no-preference')
    check(True)
    media('reduce')
    check(False)
    media('no-preference')
    check(True)
    cdp('setDeviceMetricsOverride', {**original, 'height': 650})
    check(False)
    cdp('setDeviceMetricsOverride', original)
    check(True)
    assert ev('window.stageLayoutEvents') >= 5
    print('PASS reduced-motion and short-viewport transitions: geometry, downstream seek state, static cleanup, no event loops')
finally:
    cdp('setDeviceMetricsOverride', original)
    media('no-preference')
