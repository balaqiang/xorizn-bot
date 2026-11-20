// Fitur ai/smith — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/smith", {
  "name": "chatsmith",
  "command": [
    "chatsmith",
    "smith",
    "chatsmithai",
    "smithai"
  ],
  "category": "ai",
  "desc": "AI Chat menggunakan Chat Smith (GPT-4o Mini)",
  "usage": ".chatsmith <pesan>",
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
