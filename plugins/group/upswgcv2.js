// Fitur group/upswgcv2 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/upswgcv2", {
  "name": "upswgcv2",
  "command": [
    "upswgcv2",
    "swgcadminv2",
    "grupstoryv2"
  ],
  "category": "group",
  "desc": "Post Story Group V2 (ring pink) khusus untuk Admin di grup ini",
  "usage": ".upswgcv2 <teks> atau reply media",
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
