# xorizn-bot verification map

This folder is the maintained source for verifying what xorizn-bot users can do. Read this index before you drive the app, then use the matching feature file as the recipe. Every command assumes the repo root as the working directory and `S=.claude/skills/verify-xorizn-bot/scripts`.

## Baseline preconditions

- A fresh instance from `node $S/up.mjs --name <name>`. It has an empty JSON database, the fixture owner 6289990000000, and the fixture group `120363999000000001@g.us` with the bot as admin.
- `node $S/doctor.mjs --name <name>` exits 0 and does not print `STALE`.
- Default settings: prefixes `. ! # /`, mode `public`, cooldown 2 s, registration not required, daily limit 20.
- Packs `classic`/`extra` are off unless the feature file says so. Start with `--packs classic,extra` for pack commands.
- Never drive an instance this run did not start, and never drive the user's own bot on port 3000.

## Driving conventions

- Start each recipe from the baseline. When a recipe needs state, create it through a user path (a chat command or a dashboard page) and record it.
- Chat: `chat.mjs` with `--as` and `--group` matching the user the feature is for. Assert with `--expect`.
- Dashboard: `ui.mjs` steps. Match visible text with `::-p-text()`. Use XPath `normalize-space()='…'` for exact labels.
- Use `api.mjs` dashboard routes only for setup or as a second view. `api.mjs DB/CALLS` is the side-effect view.

## Proof and skip reporting

- Chat proof: the `chat.mjs` evidence JSON (input, every outgoing call, the command that ran, log lines).
- Dashboard proof: the screenshot after the action, plus the stored state through `api.mjs DB …` or the chat behavior the setting controls.
- Name the feature ID and entry point with every artifact.
- If a path cannot be driven (media from WhatsApp, a third-party API with no key or no network), report the attempted command and the unmet precondition. Do not count it as verified through a different entry point.

## Feature entry contract

Each feature file starts with an H1 and one paragraph on user-visible behavior, then four H2s in this order: `Sub-features`, `How to get to it (user POV)`, `Driving it with chat.mjs / ui.mjs`, `Gotchas`.

## Features

- [Chat commands](./chat-commands.md): native commands in private chat and groups, the access gates (owner, admin, group-only, registration, limit), and side effects in the user record.
- [Custom commands](./custom-commands.md): the no-code builder on the dashboard (`/custom`), the dry-run test, and the command answering in chat.
- [Group moderation](./group-moderation.md): anti-link and anti-badword, set from chat or the group detail page, enforced on member messages.
- [n8n integration](./n8n-integration.md): the incoming API token (`/integrations`, `/api/v1/send`) and outgoing webhooks.
