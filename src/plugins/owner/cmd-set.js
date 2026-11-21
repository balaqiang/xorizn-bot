// Fitur _system/cmd-set — kode inti di engine/vortex
module.exports = require('../../lib/engine/vortex').plugin("_system/cmd-set", {
  "name": "setcmd",
  "command": [
    "setcmd"
  ],
  "category": "owner",
  "desc": "Perintah setcmd",
  "usage": "setcmd <teks>",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
})
