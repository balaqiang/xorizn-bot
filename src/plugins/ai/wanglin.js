// Fitur ai/wanglin — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/wanglin", {
  "name": "wanglin",
  "command": [
    "wanglin",
    "renegade"
  ],
  "category": "ai",
  "desc": "Fitur wanglin <pertanyaan>",
  "usage": ".wanglin <pertanyaan>",
  "limit": true
})
