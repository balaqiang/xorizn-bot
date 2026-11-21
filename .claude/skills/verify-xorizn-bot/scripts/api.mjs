// Call the instance over HTTP and save request + response as evidence. Exit 1 on HTTP >= 400.
//   api.mjs --name v1 GET /api/overview                       dashboard route, logged in like the dashboard pages
//   api.mjs --name v1 POST /api/custom '{"command":{...}}'     JSON body as the 3rd argument
//   api.mjs --name v1 --bearer <token> POST /api/v1/send '{"to":"6289990000001","text":"hi"}'   n8n-style API (token, no login)
// Side-effect reads through the control server (in-process, not a dashboard route):
//   api.mjs --name v1 DB users 6289990000001@s.whatsapp.net   one database document (omit the id for the whole collection)
//   api.mjs --name v1 CALLS [sinceSeq]                         every fake-socket call (outgoing WhatsApp traffic) after sinceSeq
// Fixture setup (what WhatsApp would report about a group; setup only, never proof):
//   api.mjs --name v1 GROUP '{"id":"120363999000000002@g.us","subject":"Grup B","participants":[{"number":"6281100000000","admin":null}]}'
import fs from 'node:fs'
import { parseArgs, readInstance, nextEvidencePath, http, login } from './lib.mjs'

const args = parseArgs()
const inst = readInstance(String(args.name || 'v1'))
let [method, rawRoute, bodyArg] = args._
if (method === 'GROUP') [rawRoute, bodyArg] = ['', rawRoute]
const control = ['DB', 'CALLS', 'GROUP'].includes(method)
// Git Bash rewrites "/api/x" into "C:/Program Files/Git/api/x"; accept that, and "api/x" without the slash.
const route = control || !rawRoute ? rawRoute : `/${rawRoute.slice(Math.max(0, rawRoute.indexOf('api/')))}`.replace(/^\/+/, '/')
const body = !control && bodyArg ? JSON.parse(bodyArg) : undefined
let r
if (method === 'DB') {
  const q = new URLSearchParams({ collection: route, ...(bodyArg ? { id: bodyArg } : {}) })
  r = await http('GET', `${inst.controlUrl}/db?${q}`)
} else if (method === 'CALLS') {
  r = await http('GET', `${inst.controlUrl}/calls?since=${Number(route || 0)}`)
} else if (method === 'GROUP') {
  r = await http('POST', `${inst.controlUrl}/group`, { body: JSON.parse(bodyArg || '{}') })
} else if (args.bearer) {
  r = await http(method, `${inst.dashboardUrl}${route}`, { headers: { authorization: `Bearer ${args.bearer}` }, body })
} else {
  const cookie = await login(inst)
  r = await http(method, `${inst.dashboardUrl}${route}`, { cookie, body })
}
const file = nextEvidencePath(inst.name, `api ${method} ${route || ''} ${control ? bodyArg || '' : ''}`, 'json')
fs.writeFileSync(file, JSON.stringify({ method, route: route ?? null, body: body ?? bodyArg ?? null, status: r.status, response: r.json ?? r.text }, null, 2))
console.log(`${r.status} ${method} ${route || ''}`)
console.log(JSON.stringify(r.json ?? r.text, null, 2).slice(0, 4000))
console.log(`  evidence: ${file}`)
process.exit(r.status >= 400 ? 1 : 0)
