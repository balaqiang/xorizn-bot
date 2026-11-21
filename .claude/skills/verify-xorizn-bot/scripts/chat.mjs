// Send one WhatsApp message into the bot (through the real handler) and capture what it sends back.
//   node .claude/skills/verify-xorizn-bot/scripts/chat.mjs --name v1 [--as user|owner|admin|<number>] [--group | --group-id <jid>] [--quoted "text"] [--wait 20] [--expect "regex"] ".ping"
// Prints a readable transcript and saves the full JSON (replies, args, media paths, logs) to the evidence folder.
// --expect is a case-insensitive regex tested against each reply summary ("text: ...", "react 👍", "delete", "(groupParticipantsUpdate) ...").
// Exit 1 if --expect is given and nothing matches, or if the bot logged an error for this message.
import fs from 'node:fs'
import { parseArgs, readInstance, nextEvidencePath, http, FIXTURE } from './lib.mjs'

const args = parseArgs(['group', 'from-me', 'no-pace'])
const inst = readInstance(String(args.name || 'v1'))
const text = args._.join(' ')
const as = String(args.as || 'user')
const from = { user: FIXTURE.user, owner: FIXTURE.owner, admin: FIXTURE.admin }[as] || as.replace(/\D/g, '')
const body = {
  text,
  from,
  name: args['push-name'] || `Verifier-${as}`,
  group: args['group-id'] || (args.group ? true : undefined),
  fromMe: !!args['from-me'],
  noPace: !!args['no-pace'],
  quotedText: args.quoted,
  waitMs: Number(args.wait || 20) * 1000,
  message: args.raw ? JSON.parse(args.raw) : undefined
}
const r = await http('POST', `${inst.controlUrl}/chat`, { body, timeoutMs: body.waitMs + 30_000 })
if (r.status !== 200) {
  console.error(`control /chat failed: ${r.status} ${r.text}`)
  process.exit(1)
}
const out = r.json
const file = nextEvidencePath(inst.name, `chat ${as} ${text}`, 'json')
fs.writeFileSync(file, JSON.stringify(out, null, 2))

console.log(`> [${as}${body.group ? ' in group' : ''}] ${text}`)
for (const c of out.replies) {
  if (c.method === 'sendMessage') console.log(`< ${c.summary}`)
  else if (c.method !== 'sendPresenceUpdate') console.log(`< (${c.method}) ${JSON.stringify(c.args).slice(0, 160)}`)
}
if (!out.replies.length) console.log('< (no socket calls)')
if (out.command) console.log(`  command: ${out.command.name} [${out.command.source}] ok=${out.command.ok} ${out.command.ms}ms`)
const errors = out.logs.filter((l) => l.startsWith('error'))
for (const l of errors) console.log(`  LOG ${l.split('\n')[0]}`)
console.log(`  evidence: ${file}`)

let fail = errors.length > 0
if (args.expect) {
  const re = new RegExp(String(args.expect), 'is')
  const hit = out.replies.some((c) => re.test(c.method === 'sendMessage' ? c.summary : `(${c.method}) ${JSON.stringify(c.args)}`))
  console.log(`  expect /${args.expect}/: ${hit ? 'MATCH' : 'NO MATCH'}`)
  fail ||= !hit
}
process.exit(fail ? 1 : 0)
