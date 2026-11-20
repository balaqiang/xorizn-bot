// Fitur bypass/bypass2 — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("bypass/bypass2", {
  "name": "bypass2",
  "command": [
    "bypass2"
  ],
  "category": "tools",
  "desc": "Fitur bypass2 <url>",
  "usage": ".bypass2 <url>",
  "limit": true
})
