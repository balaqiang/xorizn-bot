// Fitur fun/mimpi — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/mimpi", {
  "name": "mimpi",
  "command": [
    "mimpi",
    "dream",
    "dreamworld"
  ],
  "category": "fun",
  "desc": "Jelajahi dunia mimpimu berdasarkan nama",
  "usage": ".mimpi <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
