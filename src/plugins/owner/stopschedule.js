// Fitur owner/stopschedule — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/stopschedule", {
  "name": "stopschedule",
  "command": [
    "stopschedule",
    "stopscheduler",
    "schedstop",
    "pauseschedule"
  ],
  "category": "owner",
  "desc": "Menghentikan scheduler tertentu atau semua",
  "usage": ".stopschedule <nama|all>",
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
