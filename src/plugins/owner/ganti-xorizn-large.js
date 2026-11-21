// Fitur owner/ganti-xorizn-large — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-large", {
  "name": "xorizn-large",
  "command": [
    "xorizn-large",
    "setxoriznlarge",
    "gantixoriznlarge"
  ],
  "category": "owner",
  "desc": "Preset: Ganti gambar xorizn.jpg, serta xorizn-v7 hingga xorizn-v11.jpg sekaligus",
  "usage": ".xorizn-large (reply/kirim gambar)",
  "owner": true,
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
