// Fitur bypass/safelinku — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("bypass/safelinku", {
  "name": "safelinku",
  "command": [
    "safelinku"
  ],
  "category": "tools",
  "desc": "Fitur safelinku <url>",
  "usage": ".safelinku <url>",
  "limit": true
})
