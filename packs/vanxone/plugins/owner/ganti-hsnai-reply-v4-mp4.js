// Fitur owner/ganti-hsnai-reply-v4-mp4 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-reply-v4-mp4", {
  "name": "ganti-hsnai-reply-v4.mp4",
  "command": [
    "ganti-hsnai-reply-v4.mp4",
    "gantihsnaireplyv4",
    "sethsnaireplyv4"
  ],
  "category": "owner",
  "desc": "Ganti video hsnai-reply-v4.mp4",
  "usage": ".ganti-hsnai-reply-v4.mp4 (reply/kirim video atau URL)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
