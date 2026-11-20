// Fitur group/rulesgrup — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/rulesgrup", {
  "name": "rulesgrup",
  "command": [
    "rulesgrup",
    "grouprules",
    "aturangrup",
    "grules"
  ],
  "category": "group",
  "desc": "Menampilkan rules dan aturan grup secara lengkap",
  "usage": ".rulesgrup",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
