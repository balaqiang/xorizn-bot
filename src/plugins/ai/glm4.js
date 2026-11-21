// Fitur ai/glm4 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/glm4", {
  "name": "glm4",
  "command": [
    "glm4",
    "glm",
    "glm46v"
  ],
  "category": "ai",
  "desc": "Chat dengan GLM 4.6V",
  "usage": ".glm4 <pertanyaan>",
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
