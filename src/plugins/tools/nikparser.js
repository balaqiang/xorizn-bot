// Fitur tools/nikparser — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/nikparser", {
  "name": "nikparser",
  "command": [
    "nikparser",
    "nik",
    "ceknik"
  ],
  "category": "tools",
  "desc": "Parse dan validasi NIK KTP",
  "usage": ".nikparser <16 digit NIK>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [
      "obscura"
    ],
    "scrapers": [],
    "assets": []
  }
})
