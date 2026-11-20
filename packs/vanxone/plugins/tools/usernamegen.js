// Fitur tools/usernamegen — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/usernamegen", {
  "name": "usernamegen",
  "command": [
    "usernamegen",
    "genuser",
    "username",
    "genusername"
  ],
  "category": "tools",
  "desc": "Generate pilihan username keren berdasarkan nama, mode, & tema",
  "usage": ".usernamegen <nama> | [theme] | [mode]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
