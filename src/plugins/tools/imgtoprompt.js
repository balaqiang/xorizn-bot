// Fitur tools/imgtoprompt — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/imgtoprompt", {
  "name": "imgtoprompt",
  "command": [
    "imgtoprompt",
    "img2prompt",
    "imagetoprompt",
    "i2p"
  ],
  "category": "tools",
  "desc": "Mengubah gambar menjadi prompt AI",
  "usage": ".imgtoprompt (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [
      "img2prompt"
    ],
    "assets": []
  }
})
