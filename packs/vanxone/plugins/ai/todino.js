// Fitur ai-image/todino — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai-image/todino", {
  "name": "todino",
  "command": [
    "todino"
  ],
  "category": "ai",
  "desc": "Fitur todino (reply gambar)",
  "usage": ".todino (reply gambar)",
  "limit": true
})
