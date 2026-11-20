// Fitur bypass/sub2unlock — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("bypass/sub2unlock", {
  "name": "sub2unlock",
  "command": [
    "sub2unlock"
  ],
  "category": "tools",
  "desc": "Fitur sub2unlock <url>",
  "usage": ".sub2unlock <url>",
  "limit": true
})
