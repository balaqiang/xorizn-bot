// Fitur ai/deepai — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/deepai", {
  "name": "deepai",
  "command": [
    "deepai",
    "deep-ai"
  ],
  "category": "ai",
  "desc": "Fitur deepai <teks>",
  "usage": ".deepai <teks>",
  "limit": true
})
