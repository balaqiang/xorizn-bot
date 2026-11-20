// Fitur maker/logo3d — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/logo3d", {
  "name": "logo-3d",
  "command": [
    "logo-3d",
    "logo3d",
    "3dlogo",
    "3dtext"
  ],
  "category": "maker",
  "desc": "Buat logo dengan efek 3D pop out",
  "usage": "",
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
