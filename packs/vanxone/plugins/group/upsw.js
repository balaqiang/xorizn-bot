// Fitur group/upsw — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/upsw", {
  "name": "upsw",
  "command": [
    "upsw",
    "upstory",
    "storygc"
  ],
  "category": "group",
  "desc": "Upload story untuk grup (border hijau)",
  "usage": ".upsw <teks> / reply media",
  "owner": false,
  "group": true,
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
