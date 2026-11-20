// Fitur owner/stopalljadibot — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/stopalljadibot", {
  "name": "stopalljadibot",
  "command": [
    "stopalljadibot",
    "stopsemuajadibot",
    "killalljadibots"
  ],
  "category": "owner",
  "desc": "Hentikan semua jadibot yang aktif",
  "usage": ".stopalljadibot",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
