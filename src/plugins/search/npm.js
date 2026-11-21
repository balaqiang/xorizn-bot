// Fitur search/npm — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/npm", {
  "name": "npm",
  "command": [
    "npm",
    "npmsearch",
    "npmjs",
    "npmfind"
  ],
  "category": "search",
  "desc": "Search package di NPM registry",
  "usage": ".npm <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
