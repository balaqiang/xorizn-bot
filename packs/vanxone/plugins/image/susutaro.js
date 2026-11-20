// Fitur canvas/susutaro — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/susutaro", {
  "name": "susutaro",
  "command": [
    "susutaro",
    "taro"
  ],
  "category": "image",
  "desc": "Memberikan efek Susu Taro pada gambar",
  "usage": ".susutaro <reply image>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
