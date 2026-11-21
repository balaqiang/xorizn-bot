// Fitur rpg/idolku — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("rpg/idolku", {
  "name": "idolku",
  "command": [
    "idolku",
    "oshi",
    "panggung",
    "karirai"
  ],
  "category": "rpg",
  "desc": "Karir idol ala xorizn-bot — stage, rank, showdown, dan lainnya",
  "usage": ".idolku <profile/stage/rank/showdown/help>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
