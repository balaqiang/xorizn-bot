---
name: verify-xorizn-bot
description: Drive xorizn-bot the way a user does and capture proof, on an isolated copy of the working tree. Sends WhatsApp messages through the real message handler (a recording fake socket stands in for WhatsApp, no phone or pairing needed), clicks through the dashboard in headless Chrome, and calls the dashboard and n8n API. Use after changing plugins, src/core/handler.js, the command builder, moderation, integrations, settings, or dashboard pages, to prove the change works before reporting it done.
---

# Verify xorizn-bot

xorizn-bot is a WhatsApp bot (Baileys 7) with a local admin dashboard. Users touch three surfaces:

1. **WhatsApp chat.** Commands such as `.ping`, `.menu`, `.daftar`, group moderation, and custom commands. Every incoming message goes through `src/core/handler.js`, then a plugin.
2. **Dashboard.** A static Next.js export in `dashboard/out`, served by `src/dashboard/server.js`. It is password protected and runs on `127.0.0.1:3000` in the user's own setup.
3. **HTTP API for n8n.** `/api/v1/*` with a bearer token, plus outgoing webhooks.

Not covered: the OpenCode AI page and `.ai`/`.opencode` commands, which talk to the user's real OpenCode service; anything that downloads media from WhatsApp; real pairing and login.

## How the harness works

- `up.mjs` copies the working tree into `%TEMP%/xorizn-verify/<name>/app`. The copy holds tracked files plus untracked files that are not ignored, and leaves out `.claude/` and `.verify/`. It links `node_modules` to the repo's own, and writes a fresh `config/config.json` with a random dashboard password, free ports, the JSON database, and the fixture owner. Then it starts `node --import scripts/preload.mjs src/index.js --no-connect`.
- `--no-connect` is the app's own test mode. It runs the full boot (database, plugins, custom commands, dashboard) and never connects to WhatsApp.
- `preload.mjs` runs inside that process. After boot it puts a recording fake socket in `bot.sock`, sets the connection status to `open`, runs the same on-open steps as `src/core/connection.js`, and serves a control API on a second port. Every outgoing WhatsApp call (`sendMessage`, `groupParticipantsUpdate`, and so on) is recorded. The socket is the only thing replaced. The handler, plugins, database, and dashboard are the real code.
- **Isolation.** Each instance has its own copy, ports, database, and password, so several named instances can run side by side. The harness never reads or writes the user's `config/config.json` (except the opt-in `--copy-keys`), `data/`, or `data/session`, and it never pairs with WhatsApp. Never point these scripts at the user's own bot. A second bot on the user's WhatsApp session would replace their live connection.

All commands below run from the repo root, `G:/Primakara/bitch-bot`. `S` is short for `.claude/skills/verify-xorizn-bot/scripts`.

## Launch

```
node .claude/skills/verify-xorizn-bot/scripts/up.mjs --name v1
```

Ready means the script prints the instance JSON with `"health": { "ready": true, ... }` and exits 0. Copy plus boot takes about 15 s. On failure it exits 1 and prints the tail of `run.log`.

- `--packs classic,extra` loads the classic and extra feature packs. Boot is slower and there are many more commands. The default copies the `packs` flags from the user's config.
- `--copy-keys` copies `apiKeys` and `integrations` from the user's `config/config.json`. It is opt-in: use it only when the feature under test calls a third-party API.
- `--timeout 180` sets how many seconds to wait for boot.

The copy is a snapshot. After you edit code, run `down` then `up` again. `doctor` reports `STALE` when the working tree no longer matches the copy.

## Doctor

```
node $S/doctor.mjs --name v1
```

This check is read-only. It verifies that the process is alive, that the dashboard port belongs to that process, that the bot booted with the fake socket installed, that the control server serves this copy, that `/api/session` answers, and that the copy matches the working tree. Exit 0 means the instance is worth driving. Run it first whenever a result looks odd. If a check prints `FAIL`, run `down` and `up`.

## Drive

### WhatsApp chat: `chat.mjs`

```
node $S/chat.mjs --name v1 [--as user|owner|admin|<number>] [--group | --group-id <jid>] [--quoted "text"] [--expect "regex"] [--wait 20] [--no-pace] "<message>"
```

This builds a Baileys `messages.upsert` for the message and feeds it to the real `onMessagesUpsert`. Once the socket has been quiet for 1.5 s, it prints every outgoing call: `text: ...`, `edit: ...`, `react 👍`, `delete`, `image: caption`, or `(groupParticipantsUpdate) [...]`. It also prints which command ran and any error log lines. `--expect` is a case-insensitive regex tested against those lines. The script exits 1 when `--expect` finds no match or when the bot logged an error for this message.

Fixture identities:

| `--as` | number | role |
| --- | --- | --- |
| `user` (default) | 6289990000001 | ordinary member |
| `owner` | 6289990000000 | bot owner (config `bot.owners`); skips cooldown, limits, and moderation |
| `admin` | 6289990000002 | admin of the fixture group |
| bot | 6281100000000 | the bot itself; admin in the fixture group |

`--group` sends the message in the fixture group `120363999000000001@g.us` ("Verify Group"). That group has 4 members: the bot (admin), admin (admin), owner (member), and user (member). Use `api.mjs GROUP` to add another group or change who is admin.

### Dashboard UI: `ui.mjs`

```
node $S/ui.mjs --name v1 --step goto:/custom --step "click:::-p-text(Balasan teks)" --step shot:editor
```

This launches headless Chrome through the repo's `puppeteer-core`. It finds `C:/Program Files/Google/Chrome/Application/chrome.exe`, or Edge, or whatever `CHROME_PATH` points to. It logs in through the real login page (`#pw`, then `button[type=submit]`), then runs these steps in order:

- `goto:<path>`
- `click:<sel>`
- `type:<sel>|<text>`
- `select:<sel>|<value>`
- `wait:<sel>`
- `waitText:<text>`
- `expectText:<text>`
- `sleep:<ms>`
- `shot:<label>`

Selectors can be CSS or puppeteer selectors. When a step fails, the script takes a screenshot and exits 1. Its JSON log lists console errors and every `/api/*` response with status 400 or above.

- Routes: `/` overview, `/groups`, `/groups/detail?id=<jid>` (tabs Umum, Welcome & Goodbye, Moderasi, Auto-respon, Anggota, Aksi), `/commands`, `/users`, `/settings`, `/custom`, `/integrations`, `/system`, `/logs`, `/ai`.
- `::-p-text(X)` matches any element whose text contains X. That includes hidden `<option>`s. When one label is a prefix of another (`Simpan` and `Simpan teks / variabel`), match the exact text: `click:::-p-xpath(//button[normalize-space()='Simpan'])`.
- A setting saved from the dashboard shows a toast, `Tersimpan`. Wait for it with `waitText:Tersimpan`.
- A `<select>` next to a section heading: `select:::-p-xpath((//*[normalize-space()='Anti-link']/ancestor::*[.//select][1]//select)[1])|wa`.

### HTTP: `api.mjs`

```
node $S/api.mjs --name v1 GET /api/overview                 # dashboard route, logged in like the dashboard pages
node $S/api.mjs --name v1 PATCH /api/settings '{"cooldown":0}'
node $S/api.mjs --name v1 --bearer <token> POST /api/v1/send '{"to":"6289990000001","text":"hi"}'
node $S/api.mjs --name v1 DB users 6289990000001@s.whatsapp.net    # side effect: one database document
node $S/api.mjs --name v1 CALLS 0                                   # every outgoing WhatsApp call so far
node $S/api.mjs --name v1 GROUP '{"id":"120363999000000002@g.us","subject":"Grup B"}'   # fixture setup
```

Dashboard routes are the same calls the pages make. They are fine for setup and for a second view of state. The proof for a dashboard feature is still the `ui.mjs` journey. `DB` reads the live in-memory database. The disk copy is written 2 s later and on `down`.

## Evidence

- Everything goes to `.verify/evidence/<name>/` in the repo. That folder is gitignored and survives `down`.
- Files are numbered in order: `001-chat-user-ping.json`, `002-ui-custom-saved.png`, `003-api-...json`.
- Media the bot sent (stickers, images, audio) is saved to `media/`. `down` copies the instance's `run.log` there too.

Proof standards:

- Exercise the real user path. Chat features go through `chat.mjs`. Dashboard features go through `ui.mjs`, the actual pages. Use `api.mjs` dashboard routes only for setup or as a second view, never as the proof of a dashboard feature.
- Capture the action and the resulting state, not only the last screen. For example: the chat transcript before and after a setting changes, or a screenshot plus the stored document (`api.mjs DB ...`).
- Verify side effects as well as replies. Check database rows with `DB`, outgoing WhatsApp calls with `CALLS`, and evidence files on disk.
- The fake socket is the only mock, and it sits where production already isolates WhatsApp. Never call internal setters to make a journey pass.
- A command that needs a third-party API fails without network access or keys. Report that as an environment limit, with the logged error. It does not prove the code is broken, and it does not prove the code works.

## Cleanup

```
node $S/down.mjs --name v1        # or --all
```

This first asks the instance to shut down cleanly, which saves its database. If the instance does not stop, the script kills only the PID recorded in `instance.json`, including its child processes, and never kills by process name. Then it deletes `%TEMP%/xorizn-verify/<name>` and keeps `.verify/evidence/<name>`. Run it after every run, including failed runs.

## Feature map

`features/README.md` indexes the user-facing features. Each feature file has its entry points, a driving recipe, and gotchas. When you change a feature, drive every entry point its file lists, not only the most convenient one.

## Helpers

| script | what it does |
| --- | --- |
| `up.mjs` | copies the tree, writes the config, boots, waits until usable, prints the instance JSON |
| `doctor.mjs` | read-only health and staleness check |
| `chat.mjs` | one incoming WhatsApp message → transcript and evidence |
| `ui.mjs` | headless Chrome journey on the dashboard → screenshots and log |
| `api.mjs` | dashboard and n8n HTTP calls; `DB`, `CALLS`, and `GROUP` through the control server |
| `down.mjs` | graceful stop, then deletes the instance and keeps the evidence |
| `preload.mjs` | runs inside the bot process: fake socket and control server (`/health /chat /calls /db /flush /group /shutdown`) |
| `lib.mjs` | shared paths, fixtures, and HTTP helpers |

## Gotchas

- **Git Bash path rewriting.** Git Bash turns an argument that starts with `/` into a Windows path. `/api/x` becomes `C:/Program Files/Git/api/x`. `api.mjs` repairs this, and `goto:/x` steps are safe because the argument starts with `goto:`. For any other tool, set `MSYS_NO_PATHCONV=1` or drop the leading slash.
- **Cooldown.** Non-owner commands inside the per-user cooldown (`settings.cooldown`, default 2 s) are dropped without any reply. `chat.mjs` spaces messages from the same sender to avoid this. Pass `--no-pace` only when you are testing cooldown itself.
- **No reply can be correct.** A message that is not a command, or a command the access gates reject in silence (mode `self`, banned user, bot muted in the group), produces `(no socket calls)`. Assert the expected silence explicitly.
- **Media from WhatsApp.** `m.download()` and `m.quoted.download()` fetch from WhatsApp servers and fail here. Commands that need an incoming image, video, or sticker (such as `.sticker` on a photo) cannot be driven. Report them as not verified.
- **Fake identity.** The dashboard shows "Terhubung" and the number +6281100000000. Both come from the fixture. Group pictures return 404 because the fixture has none, so `api failure: GET /api/groups/<jid>/picture → 404` in the `ui.mjs` output is expected.
- **OpenCode.** The OpenCode card on the overview reads the user's local OpenCode service state. Do not drive `/ai` or `/api/opencode/*`, because they act on the user's real OpenCode server.
- **Disk.** Each instance is a copy of about 40 MB (about 5,700 files) in `%TEMP%`. Run `down --all` at the end of a long session.
- **Restarts.** `.restart` and the dashboard's restart button call `process.exit(100)`. No launcher runs here, so the instance stops. `doctor` then fails. Run `down` and `up`.
