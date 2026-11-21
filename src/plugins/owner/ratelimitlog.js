// Fitur owner/ratelimitlog — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ratelimitlog", {
  "name": "ratelimitlog",
  "command": [
    "ratelimitlog",
    "ratelimit",
    "rll",
    "spamlog"
  ],
  "category": "owner",
  "desc": "Monitor user yang spam command secara global, dengan auto-warning & auto-mute sementara",
  "usage": ".ratelimitlog [list|reset <user>|unmute <user>|set <maxCmd> <windowSec> <muteSec>]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
