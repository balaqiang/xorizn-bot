// Fitur search/mcpedl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/mcpedl", {
  "name": "mcpedl",
  "command": [
    "mcpedl",
    "mcpe",
    "mcpesearch",
    "searchmcpe"
  ],
  "category": "search",
  "desc": "Cari map dan addon Minecraft PE dari MCPEDL",
  "usage": ".mcpe <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
