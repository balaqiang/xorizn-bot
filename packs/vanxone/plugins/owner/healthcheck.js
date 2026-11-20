// Fitur owner/healthcheck — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/healthcheck", {
  "name": "healthcheck",
  "command": [
    "healthcheck",
    "health",
    "hc",
    "cekhealth",
    "autohc",
    "stophc",
    "hcstatus"
  ],
  "category": "owner",
  "desc": "Cek kesehatan bot dan atur auto report ke owner",
  "usage": ".healthcheck [auto <interval>|stop|status]",
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
