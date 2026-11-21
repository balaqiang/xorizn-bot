// Fitur ephoto/makingneon — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/makingneon", {
  "name": "makingneon",
  "command": [
    "makingneon"
  ],
  "category": "image",
  "desc": "Fitur makingneon <teks>",
  "usage": ".makingneon <teks>",
  "limit": true
})
