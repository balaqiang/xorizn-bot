// Fitur ephoto/galaxywallpaper — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/galaxywallpaper", {
  "name": "galaxywallpaper",
  "command": [
    "galaxywallpaper"
  ],
  "category": "image",
  "desc": "Fitur galaxywallpaper <teks>",
  "usage": ".galaxywallpaper <teks>",
  "limit": true
})
