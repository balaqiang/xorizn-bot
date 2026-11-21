# Chat commands

Users type a prefix plus a command name in a private chat or a group (`.ping`, `!menu`, `#daftar Budi.17`). The bot answers in the same chat, or answers with a fixed refusal when an access gate blocks the user. Every handled command is counted on the dashboard overview under Aktivitas Terbaru and Perintah Terpopuler.

## Sub-features

- `cmd-reply`: a native command answers (`.ping` sends `🏓 Pong!` and then edits it with the latency).
- `cmd-prefix`: every configured prefix works (`. ! # /` by default). Text without a prefix is ignored unless `noPrefix` is on.
- `cmd-owner-gate`: owner-only commands refuse other users with `🔒 Perintah ini khusus *Owner Bot*.`
- `cmd-admin-gate`: admin-only group commands refuse members with `🛡️ Perintah ini khusus *admin grup*.` In a private chat they answer with the group-only message.
- `cmd-register`: `.daftar <nama>.<umur>` registers the sender and stores `registered`, `regName`, and `regAge` on the user.
- `cmd-stats`: every command increments `stats/commands` and shows on the overview.

## How to get to it (user POV)

- Send a message that starts with a prefix in a private chat with the bot.
- Send the same in a group where the bot is a member.
- Dashboard `/commands` lists every command and lets the owner disable one. Disabled commands answer `⛔ Perintah ini sedang dinonaktifkan.`

## Driving it with chat.mjs / ui.mjs

Preconditions:

- Baseline instance. `doctor` passes.

- **Reply.** Run `node $S/chat.mjs --name v1 --expect "Pong" .ping`. The transcript shows `text: 🏓 Pong!`, then `edit: 🏓 Pong! *N ms*`, and `command: ping [native] ok=true`.
- **Other prefix.** Run `node $S/chat.mjs --name v1 --expect "Pong" "!ping"`. Same result.
- **No prefix.** Run `node $S/chat.mjs --name v1 ping`. The output is `(no socket calls)`.
- **Owner gate.** Run `node $S/chat.mjs --name v1 --as user --expect "khusus \*Owner" ".addlimit 6289990000001 5"`. Then run it again with `--as owner` and see that the refusal is gone.
- **Admin gate.** Run `node $S/chat.mjs --name v1 --as user --group --expect "admin grup" ".antilink all"`. Then run `--as admin` and get `✅ Anti-link: *all*`.
- **Register + side effect.** Run `node $S/chat.mjs --name v1 --expect "PENDAFTARAN BERHASIL" ".daftar Budi.17"`. Then run `node $S/api.mjs --name v1 DB users 6289990000001@s.whatsapp.net`, which shows `"registered": true, "regName": "Budi", "regAge": 17`.
- **Disable from dashboard.** Run `node $S/ui.mjs --name v1 --step goto:/commands --step "waitText:ping" --step "click:::-p-aria(Aktifkan ping)" --step sleep:800 --step shot:ping-disabled`. Then run `node $S/chat.mjs --name v1 --expect dinonaktifkan .ping`, which answers `⛔ Perintah ini sedang dinonaktifkan.` Then run `node $S/chat.mjs --name v1 --as owner --expect Pong .ping`. The owner still gets a reply.
- **Overview.** Run `node $S/ui.mjs --name v1 --step goto:/ --step "waitText:Aktivitas Terbaru" --step shot:overview`. The commands sent above are listed.

## Gotchas

- Non-owner commands inside the 2 s cooldown are dropped in silence. `chat.mjs` spaces them out. Use `--no-pace` only to test cooldown.
- The owner bypasses cooldown, limits, registration, and disabled commands. Test those gates as `user`.
- `.menu` and `.allmenu` build long text from the registry. Assert a stable fragment such as a category name, not the whole menu.
- Downloader and AI commands need network access and API keys (`up.mjs --copy-keys`). Without them the reply is an error, so report it as an environment limit.
- Commands that read media from the incoming message (`.sticker` on a photo, `.tomp3`) cannot be driven, because media download goes to WhatsApp servers.
