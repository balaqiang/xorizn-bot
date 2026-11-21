// Fitur ai/copilot — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/copilot", {
  "name": "copilot",
  "command": [
    "copilot"
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
