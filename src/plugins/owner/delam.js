// Fitur owner/delam — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/delam", {
  "name": "delam",
  "command": [
    "delam",
    "delamrole",
    "unam",
    "removeam"
  ],
  "category": "owner",
  "desc": "Hapus role AM (jadi free)",
  "usage": ".delam <@tag|reply|628xxx>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
