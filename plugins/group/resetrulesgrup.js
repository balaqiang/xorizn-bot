// Fitur group/resetrulesgrup — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/resetrulesgrup", {
  "name": "resetrulesgrup",
  "command": [
    "resetrulesgrup",
    "resetgrouprules"
  ],
  "category": "group",
  "desc": "Reset rules grup ke default (admin only)",
  "usage": ".resetrulesgrup",
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
