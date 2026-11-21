# Group moderation

Group admins and the owner turn on anti-link and anti-badword for each group, either with chat commands or on the group's page in the dashboard. After that, the bot deletes a matching message from an ordinary member and posts a warning, or kicks the member, depending on the action chosen. Admins, the owner, and the bot itself are exempt.

## Sub-features

- `mod-antilink-chat`: `.antilink off|wa|all` (admin only) sets the mode and answers `✅ Anti-link: *<mode>*, aksi: *<action>*.`
- `mod-antilink-ui`: on `/groups/detail?id=<jid>`, the Moderasi tab has the Anti-link mode select (Mati / Link grup/saluran WA / Semua link) and an action select (Hapus pesan / Hapus + peringatan / Keluarkan). Saving shows a "Tersimpan" toast.
- `mod-antilink-enforce`: a member's link that matches the mode is deleted and the bot posts `⚠️ @<number> mengirim link…, pesan dihapus.` A link that does not match passes.
- `mod-exempt`: admins and the owner can post links.
- `mod-antibadword`: `.antibadword on`, `.addbadword <kata>`, and the same section on the Moderasi tab. A matching word is moderated the same way.

## How to get to it (user POV)

- In the group chat: `.antilink`, `.antibadword`, `.addbadword`, `.delbadword`, `.groupsettings`.
- Dashboard: Grup, then the group card, then the Moderasi tab.

## Driving it with chat.mjs / ui.mjs

Preconditions:

- Baseline instance. The fixture group has anti-link `off` (`api.mjs DB groups 120363999000000001@g.us`).

- **Set from chat.** Run `node $S/chat.mjs --name v1 --as admin --group --expect "Anti-link: \*all" ".antilink all"`.
- **Member refused.** Run `node $S/chat.mjs --name v1 --as user --group --expect "admin grup" ".antilink off"`. The mode stays `all`.
- **Enforce.** Run `node $S/chat.mjs --name v1 --as user --group --expect "delete" "cek https://contoh.com/promo"`. The transcript shows `delete`, then `text: ⚠️ @6289990000001 mengirim link, pesan dihapus.`
- **Exempt.** Run `node $S/chat.mjs --name v1 --as owner --group "halo https://contoh.com"`. The output is `(no socket calls)`.
- **Set from dashboard.** Run `node $S/ui.mjs --name v1 --step "goto:/groups/detail?id=120363999000000001@g.us" --step "click:::-p-text(Moderasi)" --step "waitText:Anti-link" --step "select:::-p-xpath((//*[normalize-space()='Anti-link']/ancestor::*[.//select][1]//select)[1])|wa" --step "waitText:Tersimpan" --step shot:antilink-wa`. Then `api.mjs DB groups 120363999000000001@g.us` shows `"antilink": "wa"`.
- **Mode respected.** Run `node $S/chat.mjs --name v1 --as user --group "lihat https://contoh.com"`, which gives `(no socket calls)`. Then run `node $S/chat.mjs --name v1 --as user --group --expect "delete" "gabung https://chat.whatsapp.com/AbCdEf123456"`, which deletes the message and warns.
- **Anti-badword.** Run `node $S/chat.mjs --name v1 --as admin --group ".antibadword on"`, which answers `Anti kata kasar diaktifkan ✅.` Then run `node $S/chat.mjs --name v1 --as admin --group ".addbadword kampret"`, which answers `✅ Ditambahkan: kampret`. Then run `node $S/chat.mjs --name v1 --as user --group --expect delete "dasar kampret"`. The message is moderated with the same action select as anti-link.
- **Kick action.** Run `node $S/ui.mjs --name v1 --step "goto:/groups/detail?id=120363999000000001@g.us" --step "click:::-p-text(Moderasi)" --step "waitText:Anti-link" --step "select:::-p-xpath((//*[normalize-space()='Anti-link']/ancestor::*[.//select][1]//select)[2])|kick" --step "waitText:Tersimpan" --step shot:antilink-kick`. Then run `node $S/chat.mjs --name v1 --as user --group --expect "groupParticipantsUpdate.*remove" "cek https://contoh.com"`. The transcript shows `delete`, then `🚫 @6289990000001 dikeluarkan karena mengirim link.`, then `(groupParticipantsUpdate) ["120363999000000001@g.us",["6289990000001@s.whatsapp.net"],"remove"]`. The mode must match the link, so use `all` (set from chat first) for this URL.

## Gotchas

- Deleting and kicking need the bot to be a group admin. The fixture makes it one. To test "bot is not admin", run `node $S/api.mjs --name v1 GROUP '{"participants":[{"number":"6281100000000","admin":null},{"number":"6289990000002","admin":"admin"},{"number":"6289990000001","admin":null}]}'`. A matching link then gets only a counted warning (`⚠️ @… mengirim link. Peringatan 1/3.`) and no `delete` or kick.
- Anti-badword shares the action select ("Hapus pesan / Hapus + peringatan / Keluarkan") with anti-link. Reset it to `delete` when a later step expects a plain delete.
- `GET /api/groups/<jid>/picture → 404` in the `ui.mjs` output is expected, because the fixture group has no picture.
- The group page loads members from the fixture metadata. Changes made with `.add` or `.kick` are recorded calls only, and the fixture member list does not change.
