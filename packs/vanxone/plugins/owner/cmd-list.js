// Fitur _system/cmd-list — kode inti di engine/vortex
module.exports = require('../../lib/engine/vortex').plugin("_system/cmd-list", {
  "name": "listcmd",
  "command": [
    "listcmd"
  ],
  "category": "owner",
  "desc": "Perintah listcmd",
  "usage": "listcmd",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
})
