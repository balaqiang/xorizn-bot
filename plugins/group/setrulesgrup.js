// Fitur group/setrulesgrup — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/setrulesgrup", {
  "name": "setrulesgrup",
  "command": [
    "setrulesgrup",
    "setgrouprules",
    "setaturangrup"
  ],
  "category": "group",
  "desc": "Set rules/aturan grup custom (admin only)",
  "usage": ".setrulesgrup <text>",
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
