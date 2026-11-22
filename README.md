# TT Vlog

An Astro homepage with TT’s latest field note, profile, and weekend hobbies.

Edit the featured note in `src/components/Welcome.astro`. Keep it readable without JavaScript. The decorative hero radar is the only looping animation and stays still on narrow screens or when reduced motion is requested.

The field-note photo is served locally in three WebP widths (`public/bernina-express-*.webp`). If you replace it, update the responsive sources, alt text, and footer attribution together.

The hero references React Bits’ [Split Text](https://reactbits.dev/text-animations/split-text) and [Dot Grid](https://reactbits.dev/backgrounds/dot-grid). The field-note headline adapts [Scroll Reveal](https://reactbits.dev/text-animations/scroll-reveal) as sequential color changes. These are native CSS interpretations, not React components.

The field note uses a CSS view timeline for its headline accent and photo rule. The copy and photo stay visible without timeline support, and `prefers-reduced-motion` disables the entrance and scroll effects.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## AI coding tools

This repository follows [Astro's AI tools guide](https://docs.astro.build/en/guides/build-with-ai/)
and connects to the official Astro Docs MCP server over Streamable HTTP.
No API key, local proxy, or additional npm dependency is required.

| Tool | Project configuration | Activation |
| --- | --- | --- |
| Codex | `.codex/config.toml` | Start a new session from this repository and trust the project if prompted. Run `codex mcp get astro-docs` to inspect the loaded connection; use `/mcp` in the CLI to check available tools. |
| Claude Code | `.mcp.json` | Start Claude Code from this repository and approve the project MCP server if prompted. Use `/mcp` to check its connection. |

Try: “Use astro-docs to explain how to reference public assets with this project's base path in Astro 7.”
The endpoint is `https://mcp.docs.astro.build/mcp`; internet access is required.
If connection fails, restart the AI tool and check its project trust/MCP settings.
For tools other than Codex and Claude Code, follow the tool-specific setup in the linked guide.

The installed project uses Astro 7.4.13 and requires Node.js 22.23.4 or later
(CI uses Node.js 24). Check documentation examples against the installed version.
The Astro configuration explicitly preserves pre-v7 HTML whitespace handling.
Project coding rules live in `AGENTS.md` and `CLAUDE.md`.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
