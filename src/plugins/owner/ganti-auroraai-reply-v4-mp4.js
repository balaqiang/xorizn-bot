// Fitur owner/ganti-auroraai-reply-v4-mp4 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-reply-v4-mp4", {
  "name": "ganti-auroraai-reply-v4.mp4",
  "command": [
    "ganti-auroraai-reply-v4.mp4",
    "gantiauroraaireplyv4",
    "setauroraaireplyv4"
  ],
  "category": "owner",
  "desc": "Ganti video auroraai-reply-v4.mp4",
  "usage": ".ganti-auroraai-reply-v4.mp4 (reply/kirim video atau URL)",
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
