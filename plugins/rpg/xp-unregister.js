// Fitur economy/xp-unregister — kode inti di engine/vortex
module.exports = require('../../lib/engine/vortex').plugin("economy/xp-unregister", {
  "name": "unregister",
  "command": [
    "unregister"
  ],
  "category": "rpg",
  "desc": "Perintah unregister",
  "usage": "unreg",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
})
