// Fitur tools/nftoken — kode inti di engine/vortex
module.exports = require('../../lib/engine/vortex').plugin("tools/nftoken", {
  "name": "nftoken",
  "command": [
    "nftoken",
    "nft",
    "netflixtoken"
  ],
  "category": "tools",
  "desc": "Perintah nftoken",
  "usage": "nftoken",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
})
