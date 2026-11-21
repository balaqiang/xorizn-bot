// Fitur owner/bcpcjeda — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/bcpcjeda", {
  "name": "bcpcjeda",
  "command": [
    "bcpcjeda",
    "delaybcpc",
    "jedabcpc",
    "setjedabcpc"
  ],
  "category": "owner",
  "desc": "Atur jeda broadcast private chat",
  "usage": ".bcpcjeda <waktu> (contoh: 5s, 2m, 1h)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
