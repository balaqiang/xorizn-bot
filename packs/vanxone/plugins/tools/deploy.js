// Fitur tools/deploy — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/deploy", {
  "name": "deploy",
  "command": [
    "deploy",
    "vercel"
  ],
  "category": "tools",
  "desc": "Deploy HTML atau file ZIP ke Vercel",
  "usage": ".deploy <namawebsite>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
