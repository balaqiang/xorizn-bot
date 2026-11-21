// Fitur ai/megumin — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/megumin", {
  "name": "meguminai",
  "command": [
    "meguminai",
    "megu"
  ],
  "category": "ai",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
