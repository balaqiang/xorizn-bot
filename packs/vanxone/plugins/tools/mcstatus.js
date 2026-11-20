// Fitur tools/mcstatus — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/mcstatus", {
  "name": "mcstatus",
  "command": [
    "mcstatus",
    "mcstat"
  ],
  "category": "tools",
  "desc": "Mengecek status server Minecraft Java",
  "usage": ".mcstatus <ip/domain[:port]>",
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
