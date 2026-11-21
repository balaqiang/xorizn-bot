// Fitur canvas/fakedana — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakedana", {
  "name": "fakedana",
  "command": [
    "fakedana",
    "danafake"
  ],
  "category": "image",
  "desc": "Membuat gambar fake dana",
  "usage": ".fakedana <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
