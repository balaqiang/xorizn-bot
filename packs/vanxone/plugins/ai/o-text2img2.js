// Fitur ai/o-text2img2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/text2img2", {
  "name": "text2img2",
  "command": [
    "text2img2",
    "t2i2",
    "genimg"
  ],
  "category": "ai",
  "desc": "Generate image from text using AI",
  "usage": ".text2img2 <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 5,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
