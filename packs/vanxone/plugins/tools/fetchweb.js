// Fitur tools/fetchweb — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/fetchweb", {
  "name": "fetchweb",
  "command": [
    "fetchweb",
    "webget",
    "getweb",
    "ambilweb",
    "downloadweb"
  ],
  "category": "tools",
  "desc": "Fetch dan simpan halaman web",
  "usage": ".fetchweb <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 5,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
