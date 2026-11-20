// Fitur owner/akses — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/akses", {
  "name": "akses",
  "command": [
    "akses",
    "addakses",
    "delakses",
    "listakses",
    "addaccess",
    "delaccess",
    "listaccess"
  ],
  "category": "owner",
  "desc": "Grant temporary/permanent command access to users",
  "usage": ".addakses <cmd> <duration> <user>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
