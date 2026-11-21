// Fitur owner/listjadibot — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/listjadibot", {
  "name": "listjadibot",
  "command": [
    "listjadibot",
    "jadibotlist",
    "alljadibot"
  ],
  "category": "owner",
  "desc": "Lihat semua session jadibot yang tersimpan",
  "usage": ".listjadibot",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
