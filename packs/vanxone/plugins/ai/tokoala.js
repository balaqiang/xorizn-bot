// Fitur ai-image/tokoala — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai-image/tokoala", {
  "name": "tokoala",
  "command": [
    "tokoala"
  ],
  "category": "ai",
  "desc": "Fitur tokoala (reply foto)",
  "usage": ".tokoala (reply foto)",
  "limit": true
})
