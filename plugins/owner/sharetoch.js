// Fitur owner/sharetoch — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/sharetoch", {
  "name": "sharetoch",
  "command": [
    "sharetoch",
    "sharetosaluran"
  ],
  "category": "owner",
  "desc": "Share ke channel tanpa watermark",
  "usage": ".sharetoch (reply pesan)",
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
