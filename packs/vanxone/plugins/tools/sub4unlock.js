// Fitur bypass/sub4unlock — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("bypass/sub4unlock", {
  "name": "sub4unlock",
  "command": [
    "sub4unlock"
  ],
  "category": "tools",
  "desc": "Fitur sub4unlock <url>",
  "usage": ".sub4unlock <url>",
  "limit": true
})
