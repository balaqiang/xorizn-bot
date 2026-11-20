// Fitur ai/ainsfw — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("ai/ainsfw", {
  "name": "ainsfw",
  "command": [
    "ainsfw",
    "nsfwai",
    "aiimage18"
  ],
  "category": "ai",
  "desc": "Generate AI image (NSFW - 18+)",
  "usage": ".ainsfw <prompt>",
  "owner": false,
  "group": false,
  "private": true,
  "premium": true,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
