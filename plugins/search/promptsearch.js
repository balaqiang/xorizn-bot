// Fitur search/promptsearch — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("search/promptsearch", {
  "name": "promptsearch",
  "command": [
    "promptsearch",
    "promptcari",
    "searchprompt",
    "cariprompt",
    "prompthero"
  ],
  "category": "search",
  "desc": "Cari prompt AI di PromptHero.com",
  "usage": ".promptsearch <keyword>",
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
