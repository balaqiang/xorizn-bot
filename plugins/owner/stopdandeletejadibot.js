// Fitur owner/stopdandeletejadibot — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/stopdandeletejadibot", {
  "name": "stopdandeletejadibot",
  "command": [
    "stopdandeletejadibot",
    "deletejadibot",
    "removejadibot",
    "hapusjadibot"
  ],
  "category": "owner",
  "desc": "Stop dan hapus session jadibot user secara permanen",
  "usage": ".stopdandeletejadibot @user",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
