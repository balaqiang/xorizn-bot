// Fitur ai/promptgen — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/promptgen", {
  "name": "promptgen",
  "command": [
    "promptgen",
    "promptai",
    "genprompt",
    "prompt"
  ],
  "category": "ai",
  "desc": "Fitur promptgen <deskripsi>",
  "usage": ".promptgen <deskripsi>",
  "limit": true
})
