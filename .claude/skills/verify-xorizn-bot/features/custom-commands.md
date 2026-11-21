# Custom commands

The owner builds new chat commands in the dashboard without writing code. A command is a list of steps: call an API, pick data, set a variable, check a condition, reply, react, ask AI, wait, or stop. The owner can try it once on the page, save it, and after that any user can run it in WhatsApp.

## Sub-features

- `custom-create`: the "Perintah baru" button or a preset (Balasan teks, Gambar acak dari API, Kirim ke n8n & balas) opens the editor. Simpan stores the command and it appears in the list as `.name`.
- `custom-run`: the saved command answers in chat and fills in templates such as `{{sender.name}}` and `{{text}}`.
- `custom-try`: "▶ Coba" runs the steps for real (APIs are called) without sending to WhatsApp, and shows the result on the page.
- `custom-toggle`: the switch in the list disables or enables the command. A disabled command no longer answers.
- `custom-override`: "Timpa perintah bawaan bernama sama" lets a custom command replace a native one with the same name. Without it, saving shows `Nama … sudah dipakai fitur bawaan`.
- `custom-delete`: the trash button removes the command.

## How to get to it (user POV)

- Dashboard sidebar, then "Perintah Kustom" (`/custom`).
- In chat: `.<name>` once saved. The command also appears in `.menu` under its category (default `custom`).

## Driving it with chat.mjs / ui.mjs

Preconditions:

- Baseline instance. No custom command named `rules` exists (`api.mjs DB customCommands rules` prints `null`).

- **Create from preset.** Run `node $S/ui.mjs --name v1 --step goto:/custom --step "click:::-p-text(Balasan teks)" --step "waitText:Perintah baru" --step shot:custom-editor --step "click:::-p-xpath(//button[normalize-space()='Simpan'])" --step "waitText:.rules" --step shot:custom-saved`. The list shows `.rules`.
- **Stored.** Run `node $S/api.mjs --name v1 DB customCommands rules`. It shows `"name": "rules"`, `"enabled": true`, and one `reply` step.
- **Run in chat.** Run `node $S/chat.mjs --name v1 --expect "Aturan grup" .rules`. The reply is `📜 Aturan grup: … Sopan ya Verifier-user`, with the template filled from the pushName, and `command: rules [custom] ok=true`.
- **Disable.** Run `node $S/ui.mjs --name v1 --step goto:/custom --step "waitText:.rules" --step "click:::-p-aria(Aktifkan rules)" --step sleep:800 --step shot:rules-disabled`. Then run `node $S/chat.mjs --name v1 .rules`. The output is `(no socket calls)`.
- **Name clash.** Run `node $S/ui.mjs --name v1 --step goto:/custom --step "click:::-p-xpath(//button[normalize-space()='Perintah baru'])" --step "type:::-p-xpath(//span[normalize-space()='Nama perintah']/following::input[1])|ping" --step "click:::-p-xpath(//button[substring(normalize-space(),string-length(normalize-space())-4)='Balas'])" --step "type:::-p-xpath(//span[normalize-space()='Teks']/following::textarea[1])|halo" --step "click:::-p-xpath(//button[normalize-space()='Simpan'])" --step "waitText:sudah dipakai fitur bawaan" --step shot:name-clash`.
- **Try on the page (not yet driven).** Open the command with "Ubah", type into the "Teks setelah perintah" field, click "▶ Coba", and assert the result panel with `waitText:`. Record the selectors here once you have driven this step.

## Gotchas

- `::-p-text(Simpan)` first matches the hidden option "Simpan teks / variabel". Always use the exact-text XPath for the Simpan button.
- Field labels are `<span>`s, not `<label>`s. Reach the input with `//span[normalize-space()='<label>']/following::input[1]` (or `textarea`). The step buttons carry an emoji before the name, so match them by how the label ends.
- HTTP steps only reach hosts on the allow list (the "Host yang diizinkan" box on `/custom`) and the public internet. Without network access, "Coba" and the chat run both fail at the HTTP step. That is an environment limit.
- The "AI" step uses the AI settings from `/settings`, so it needs `--copy-keys` or a key entered there.
- Renaming a command in the editor deletes the old name. Assert that the old name stops answering.
