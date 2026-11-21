// Fitur _system/cmd-lock — kode inti di engine/vortex
module.exports = require('../../lib/engine/vortex').plugin("_system/cmd-lock", {
  "name": "unlockcmd",
  "command": [
    "unlockcmd"
  ],
  "category": "owner",
  "desc": "Perintah unlockcmd",
  "usage": "un",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
})
