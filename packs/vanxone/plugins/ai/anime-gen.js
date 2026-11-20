// Fitur ai/anime-gen — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/anime-gen", {
  "name": "anime-gen",
  "command": [
    "anime-gen",
    "animegen",
    "aianimegen",
    "genai-anime"
  ],
  "category": "ai",
  "desc": "Generate AI anime art dari prompt",
  "usage": ".anime-gen <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
