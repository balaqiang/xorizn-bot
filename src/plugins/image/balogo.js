// Fitur canvas/balogo — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/balogo", {
  "name": "balogo",
  "command": [
    "balogo",
    "bluearchivelogo",
    "ba"
  ],
  "category": "image",
  "desc": "Membuat logo Blue Archive style",
  "usage": ".balogo <textL> & <textR>",
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
