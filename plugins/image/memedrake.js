// Fitur maker/memedrake — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("maker/memedrake", {
  "name": "memedrake",
  "command": [
    "memedrake",
    "drake"
  ],
  "category": "image",
  "desc": "Fitur memedrake <teks1>|<teks2>",
  "usage": ".memedrake <teks1>|<teks2>",
  "limit": true
})
