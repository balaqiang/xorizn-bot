// Fitur ai/aifilter — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/aifilter", {
  "name": "aifilter",
  "command": [
    "aifilter",
    "filterai",
    "filterreaction",
    "filter-reaction",
    "reactionfilter"
  ],
  "category": "ai",
  "desc": "AI image filter dan perubahan ekspresi wajah, diadaptasi dari CANTARELLA",
  "usage": ".aifilter <style> (reply gambar) / .filterreaction <expression> (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
