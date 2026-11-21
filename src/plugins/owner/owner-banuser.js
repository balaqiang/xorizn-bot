// Fitur owner/owner-banuser — kode inti di engine/vortex
module.exports = require('../../lib/engine/vortex').plugin("owner/owner-banuser", {
  "name": "banuser",
  "command": [
    "banuser"
  ],
  "category": "owner",
  "desc": "Perintah banuser",
  "usage": "ban",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
})
