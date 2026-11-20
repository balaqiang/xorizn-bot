// Fitur ephoto/papercutstyle — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/papercutstyle", {
  "name": "papercutstyle",
  "command": [
    "papercutstyle"
  ],
  "category": "image",
  "desc": "Fitur papercutstyle <teks>",
  "usage": ".papercutstyle <teks>",
  "limit": true
})
