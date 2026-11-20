// Fitur owner/addam — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/addam", {
  "name": "addam",
  "command": [
    "addam",
    "addamrole",
    "setam"
  ],
  "category": "owner",
  "desc": "Tambah role Alight Motion (member/reseller/premium/partner/owner)",
  "usage": ".addam <role> <@tag|reply|628xxx>",
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
