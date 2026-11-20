// Fitur bypass/sfl — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("bypass/sfl", {
  "name": "sfl",
  "command": [
    "sfl",
    "bypasssfl",
    "sflbypass"
  ],
  "category": "tools",
  "desc": "Fitur sfl <url>",
  "usage": ".sfl <url>",
  "limit": true
})
