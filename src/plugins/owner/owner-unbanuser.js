// Fitur owner/owner-unbanuser — kode inti di engine/vortex
module.exports = require('../../lib/engine/vortex').plugin("owner/owner-unbanuser", {
  "name": "unbanuser",
  "command": [
    "unbanuser"
  ],
  "category": "owner",
  "desc": "Perintah unbanuser",
  "usage": "unban",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
})
