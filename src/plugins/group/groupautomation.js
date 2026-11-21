// Fitur group/groupautomation — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/groupautomation", {
  "name": "antiunadmin",
  "command": [
    "antiunadmin",
    "antidemote",
    "antikick",
    "autoinfogc",
    "antiadmin"
  ],
  "category": "group",
  "desc": "Pengaturan perlindungan admin, AntiKick, info grup, dan sambutan anggota",
  "usage": ".antiunadmin on/off | .antikick on/off | .autoinfogc on/off | .autosambut on/off | .antiadmin on/off | .antiadmin izin @taguser",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
