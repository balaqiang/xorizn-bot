// Fitur clan/clandesc — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clandesc", {
  "name": "clandesc",
  "command": [
    "clandesc",
    "editdesc",
    "clandescription"
  ],
  "category": "rpg",
  "desc": "Edit deskripsi clan",
  "usage": ".clandesc <deskripsi>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
