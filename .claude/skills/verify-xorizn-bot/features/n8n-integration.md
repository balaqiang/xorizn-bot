# n8n integration

The owner connects the bot to n8n or another app in two directions. Incoming, an app sends WhatsApp messages through the bot's HTTP API using a token made in the dashboard. Outgoing, the bot posts events (`message`, `command`, …) to webhook URLs, and can send n8n's JSON reply back to the chat.

## Sub-features

- `api-enable`: on `/integrations` (API masuk), the "Aktifkan API" switch creates a token. The token is shown once ("Simpan token ini sekarang — hanya ditampilkan sekali").
- `api-send`: `POST /api/v1/send` with `Authorization: Bearer <token>` and `{"to","text"|"image"|…}` sends the message. The response is `{"ok":true,"to":"…@s.whatsapp.net","id":…}`.
- `api-reject`: a wrong token gives 401 `Token API salah.` With the API off, the response is 403 `API belum diaktifkan di dashboard.`
- `api-status`: `GET /api/v1/status` and `GET /api/v1/groups`.
- `webhook-out`: under Webhook keluar, the "Tambah" button, then URL and events, then "Simpan webhook". Matching events are POSTed to the URL, and "Kirim tes" sends a test event.

## How to get to it (user POV)

- Dashboard sidebar, then "Integrasi (n8n)" (`/integrations`).
- An HTTP Request node in n8n (or curl) against `http://<dashboard host>:<port>/api/v1/...`.

## Driving it with chat.mjs / ui.mjs

Preconditions:

- Baseline instance. The API is off (`api.mjs --name v1 GET /api/integrations` shows `"enabled": false`).

- **Rejected while off.** Run `node $S/api.mjs --name v1 --bearer x POST /api/v1/send '{"to":"6289990000001","text":"x"}'`. The response is 403.
- **Enable and read the token.** Run `node $S/ui.mjs --name v1 --step goto:/integrations --step "waitText:API masuk" --step "click:::-p-xpath((//*[normalize-space()='Aktifkan API']/ancestor::*[.//*[@data-slot='switch']][1]//*[@data-slot='switch'])[1])" --step "waitText:hanya ditampilkan sekali" --step "text:::-p-xpath(//*[contains(normalize-space(),'hanya ditampilkan sekali')]/following-sibling::code[1])" --step shot:api-enabled`. The `TEXT` line holds the token.
- **Send.** Run `node $S/api.mjs --name v1 --bearer <token> POST /api/v1/send '{"to":"6289990000001","text":"halo dari n8n"}'`. The response is 200 with `"ok": true`.
- **Delivered.** Run `node $S/api.mjs --name v1 CALLS 0`. It contains a `sendMessage` to `6289990000001@s.whatsapp.net` with summary `text: halo dari n8n`.
- **Wrong token.** Run the same send with `--bearer wrong`. The response is 401.
- **Webhook out.** Start a local receiver in the background and keep its PID: `node -e "require('http').createServer((q,s)=>{let b='';q.on('data',c=>b+=c);q.on('end',()=>{require('fs').appendFileSync('.verify/evidence/v1/webhook.log',b+'\n');s.setHeader('content-type','application/json');s.end('{}')})}).listen(5679)" &`. Then run `node $S/ui.mjs --name v1 --step goto:/integrations --step "waitText:Webhook keluar" --step "click:::-p-xpath(//button[normalize-space()='Tambah'])" --step "type:::-p-xpath(//span[normalize-space()='URL']/following::input[1])|http://localhost:5679/hook" --step "click:::-p-xpath(//button[normalize-space()='Simpan webhook'])" --step "waitText:Salin secret" --step shot:webhook-saved`. A new webhook subscribes to `message` by default. Run `node $S/chat.mjs --name v1 "halo webhook"`. `webhook.log` then holds `{"event":"message",…,"data":{…,"text":"halo webhook",…}}`. Kill the receiver by the PID you kept.

## Gotchas

- The token is shown only once. Read it in the same `ui.mjs` run with the `text:` step. Reloading the page shows only the masked hint.
- The API allows 60 requests per minute for each instance. Loops get 429.
- "Balas dari n8n" sends n8n's `{"reply":"…"}` to the chat. To check it, the local receiver must answer with that JSON.
