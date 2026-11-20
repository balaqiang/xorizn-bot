// Fitur owner/cekschedule — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/cekschedule", {
  "name": "cekschedule",
  "command": [
    "cekschedule",
    "cekscheduler",
    "schedulerstatus",
    "schedstatus"
  ],
  "category": "owner",
  "desc": "Melihat status semua scheduler bot",
  "usage": ".cekschedule",
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
