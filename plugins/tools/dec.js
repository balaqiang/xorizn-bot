// Fitur tools/dec — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/dec", {
  "name": "dec",
  "command": [
    "dec",
    "deobfuscate",
    "deobf",
    "unobf"
  ],
  "category": "tools",
  "desc": "Deobfuscate/membongkar kode JavaScript yang teracak (javascript-obfuscator, dll)",
  "usage": ".dec <code> atau reply file .js",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
