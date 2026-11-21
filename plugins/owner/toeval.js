// Fitur owner/toeval — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/toeval", {
  "name": "toeval",
  "command": [
    "toeval",
    "tev",
    "autoeval",
    "2eval"
  ],
  "category": "owner",
  "desc": "Reply kode plugin (ESM/CJS), auto-convert ke bentuk eval-able lalu langsung dijalanin persis seperti .ev",
  "usage": ".toeval (reply ke pesan/file berisi kode)",
  "owner": true,
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
