// Fitur grup/votekick — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("grup/votekick", {
  "name": "votekick",
  "command": [
    "votekick",
    "vkick",
    "kik2",
    "vkik"
  ],
  "category": "group",
  "desc": "Perintah votekick",
  "usage": "",
  "group": true,
  "admin": true,
  "botAdmin": true
})
