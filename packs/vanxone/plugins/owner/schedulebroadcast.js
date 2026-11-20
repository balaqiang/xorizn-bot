// Fitur owner/schedulebroadcast — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/schedulebroadcast", {
  "name": "schedulebroadcast",
  "command": [
    "schedulebroadcast",
    "scbc",
    "bcsched",
    "jadwalbc"
  ],
  "category": "owner",
  "desc": "Jadwalkan broadcast ke semua grup/user di tanggal & jam tertentu",
  "usage": ".schedulebroadcast add <DD/MM HH:MM | HH:MM repeat> <grup/user/all> <pesan>",
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
