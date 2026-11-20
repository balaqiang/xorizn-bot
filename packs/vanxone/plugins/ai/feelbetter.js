// Fitur ai/feelbetter — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/feelbetter", {
  "name": "feelbetter",
  "command": [
    "feelbetter",
    "feelbetterbot",
    "healing"
  ],
  "category": "ai",
  "desc": "Chat dengan FeelBetterBot — AI yang siap mendengarkan tanpa menghakimi",
  "usage": ".feelbetter <curhat/pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [
      "feeb"
    ],
    "assets": []
  }
})
