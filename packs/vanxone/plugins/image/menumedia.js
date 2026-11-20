// Fitur canvas/menumedia — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("canvas/menumedia", {
  "name": "menumedia",
  "command": [
    "menumedia",
    "mediamenu",
    "listmenumedia"
  ],
  "category": "image",
  "desc": "Menu fitur media: IQC, VOS, dan VOSV2.",
  "usage": ".menumedia",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
