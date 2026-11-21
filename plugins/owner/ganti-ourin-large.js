// Fitur owner/ganti-ourin-large — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-large", {
  "name": "ourin-large",
  "command": [
    "ourin-large",
    "setourinlarge",
    "gantiourinlarge"
  ],
  "category": "owner",
  "desc": "Preset: Ganti gambar ourin.jpg, serta ourin-v7 hingga ourin-v11.jpg sekaligus",
  "usage": ".ourin-large (reply/kirim gambar)",
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
