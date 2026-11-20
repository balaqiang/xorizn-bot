// Fitur _system/cmd-del — kode inti di engine/vortex
module.exports = require('../../lib/engine/vortex').plugin("_system/cmd-del", {
  "name": "delcmd",
  "command": [
    "delcmd"
  ],
  "category": "owner",
  "desc": "Perintah delcmd",
  "usage": "delcmd",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
})
