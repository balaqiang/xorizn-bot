// Fitur anime/autoanimewinbu — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/autoanimewinbu", {
  "name": "autoanimewinbu",
  "command": [
    "autoanimewinbu",
    "aaw",
    "autoanime"
  ],
  "category": "anime",
  "desc": "Auto upload ongoing anime & donghua dari winbu.net (720p Pixeldrain)",
  "usage": ".autoanimewinbu <start|stop|status|cek|list|reset|addgrup|delgrup>",
  "owner": true,
  "group": false,
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
