// Fitur rpg/streamer — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/streamer", {
  "name": "streamer",
  "command": [
    "streamer",
    "live",
    "vtuber"
  ],
  "category": "rpg",
  "desc": "Live streaming game dapet donasi besar tapi resiko dibanned platform!",
  "usage": ".streamer",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 180,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
