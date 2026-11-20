// Fitur group/cekidgc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/cekidgc", {
  "name": "cekidgc",
  "command": [
    "idgrup",
    "groupid",
    "groupinfo"
  ],
  "category": "group",
  "desc": "Cek ID dan info lengkap grup",
  "usage": ".cekidgc [link grup]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
