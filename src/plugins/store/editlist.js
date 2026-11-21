// Fitur store/editlist — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/editlist", {
  "name": "editlist",
  "command": [
    "editlist",
    "editinfo"
  ],
  "category": "store",
  "desc": "✏️ Edit informasi toko (hanya di private chat)",
  "usage": ".editlist <nomor> <field> <nilai>",
  "owner": true,
  "group": false,
  "private": true,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
