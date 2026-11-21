// lib/ownerx.js — pengaturan owner tambahan (banchat, anticall, autoread, autotyping)
'use strict'
const st = require('./jstore').open('ownerx', { banchat: [], anticall: false, autoread: false, autotyping: false, callBlock: false })
module.exports = st
