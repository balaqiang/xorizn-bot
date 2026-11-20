// Fitur stalker/o-stalkml — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("stalker/stalkml", {
  "name": "stalkml",
  "command": [
    "stalkml",
    "mlstalk",
    "ceknickml",
    "nickml"
  ],
  "category": "stalker",
  "desc": "Mengetahui nama/nickname akun Mobile Legends berdasarkan ID dan Server.",
  "usage": ".stalkml <id> | <server>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
