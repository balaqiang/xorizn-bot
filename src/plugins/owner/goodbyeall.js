// Fitur owner/goodbyeall — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/goodbyeall", {
  "name": "goodbyeall",
  "command": [
    "goodbyeall",
    "gball",
    "globalgoodbye",
    "leaveall"
  ],
  "category": "owner",
  "desc": "Aktifkan/nonaktifkan goodbye di semua grup",
  "usage": ".goodbyeall <on/off>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
