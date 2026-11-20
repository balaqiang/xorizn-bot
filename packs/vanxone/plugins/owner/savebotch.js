// Fitur owner/savebotch — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/savebotch", {
  "name": "savebotch",
  "command": [
    "savebotch",
    "sbc",
    "wlchannel",
    "channelwl"
  ],
  "category": "owner",
  "desc": "Daftarkan saluran (channel) tertentu supaya bot bisa dipakai di situ walau mode onlygc aktif, plus opsi owner-only per saluran",
  "usage": ".savebotch <add/del/list/ownerOnly> [jid/link saluran] [on/off]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
