// Fitur canvas/iqcpink — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/iqcpink", {
  "name": "iqcpink",
  "command": [
    "iqcpink"
  ],
  "category": "image",
  "desc": "Membuat Fake Quote iOS style versi pink.",
  "usage": ".iqcpink [text/reply]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
