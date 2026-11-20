// Fitur tools/resizevideo — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/resizevideo", {
  "name": "resizevideo",
  "command": [
    "resizevideo",
    "resizevid"
  ],
  "category": "tools",
  "desc": "Mengubah resolusi video tanpa mengubah rasio",
  "usage": ".resizevideo [lebar] (reply video)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
