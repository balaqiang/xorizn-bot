// Fitur owner/startschedule — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/startschedule", {
  "name": "startschedule",
  "command": [
    "startschedule",
    "startscheduler",
    "schedstart",
    "resumeschedule"
  ],
  "category": "owner",
  "desc": "Memulai ulang scheduler tertentu atau semua",
  "usage": ".startschedule <nama|all>",
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
