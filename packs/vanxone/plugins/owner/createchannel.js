// Fitur owner/createchannel — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/createchannel", {
  "name": "createchannel",
  "command": [
    "createchannel",
    "createch"
  ],
  "category": "owner",
  "desc": "Membuat WhatsApp Channel/newsletter baru",
  "usage": ".createchannel <nama>|<deskripsi>",
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
