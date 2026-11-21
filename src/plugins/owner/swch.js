// Fitur owner/swch — kode inti di engine/lumen
module.exports = require('../../lib/engine/lumen').plugin("owner/swch", {"command": ["channelstatus", "cslist", "csq", "csquestion", "csreact", "csrevoke", "csu", "csupdates"], "category": "owner", "owner": true, "group": false, "admin": false, "botAdmin": false, "desc": "Fitur channelstatus"})
