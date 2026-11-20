// Fitur _system/@verify — kode inti di engine/vortex
module.exports = require('../../lib/engine/vortex').plugin("_system/@verify", {
  "name": "@verify",
  "command": [
    "@verify"
  ],
  "category": "owner",
  "desc": "Perintah @verify",
  "usage": "@verify",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
})
