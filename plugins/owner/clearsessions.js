// Fitur owner/clearsessions — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/clearsessions", {
  "name": "clearsessions",
  "command": [
    "clearsessions",
    "clearsession",
    "delsession",
    "delsessions"
  ],
  "category": "owner",
  "desc": "Menghapus semua session di storage/sessions/",
  "usage": ".clearsessions",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
