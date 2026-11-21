// Fitur pushkontak/pushkontak — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("pushkontak/pushkontak", {
  "name": "pushkontak",
  "command": [
    "pushkontak",
    "puskontak",
    "push",
    "stoppush",
    "setjedapush",
    "pushkontak_start",
    "kelolapush",
    "autovcf_on",
    "autovcf_off",
    "kodeunik_on",
    "kodeunik_off",
    "vcftarget_private",
    "vcftarget_group",
    "skipadmin_on",
    "skipadmin_off"
  ],
  "category": "broadcast",
  "desc": "Push pesan ke semua member grup + auto simpan kontak VCF",
  "usage": ".pushkontak",
  "owner": true,
  "group": true,
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
