// Fitur group/resetwelcome — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/resetwelcome", {
  "name": "resetwelcome",
  "command": [
    "resetwelcome",
    "delwelcome",
    "clearwelcome"
  ],
  "category": "group",
  "desc": "Reset welcome message ke default",
  "usage": ".resetwelcome",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
