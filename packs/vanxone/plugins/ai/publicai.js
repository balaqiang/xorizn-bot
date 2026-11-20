// Fitur ai/publicai — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/publicai", {
  "name": "publicai",
  "command": [
    "publicai"
  ],
  "category": "ai",
  "desc": "Fitur publicai <pertanyaan>",
  "usage": ".publicai <pertanyaan>",
  "limit": true
})
