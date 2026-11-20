/* Bitch Bot Dashboard — SPA tanpa build step */

// ================= utils =================
const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const fmtNum = (n) => Number(n || 0).toLocaleString('id-ID')
const fmtBytes = (n) => { if (!n) return '0 B'; const u = ['B', 'KB', 'MB', 'GB']; const i = Math.min(3, Math.floor(Math.log(n) / Math.log(1024))); return `${(n / 1024 ** i).toFixed(i ? 1 : 0)} ${u[i]}` }
const fmtDur = (ms) => { const s = Math.floor(ms / 1000); const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60); return [d && `${d}h`, h && `${h}j`, `${m}m`].filter(Boolean).join(' ') }
const fmtAgo = (t) => { if (!t) return '-'; const s = Math.floor((Date.now() - t) / 1000); if (s < 60) return 'baru saja'; if (s < 3600) return `${Math.floor(s / 60)} mnt lalu`; if (s < 86400) return `${Math.floor(s / 3600)} jam lalu`; return `${Math.floor(s / 86400)} hari lalu` }
const fmtDate = (t) => (t ? new Date(t).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-')
const initials = (s) => String(s || '?').replace(/[^\p{L}\p{N} ]/gu, '').trim().split(/\s+/).slice(0, 2).map((w) => [...w][0] || '').join('').toUpperCase() || '#'
const debounce = (fn, ms = 400) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) } }

const ICONS = {
  dashboard: '<path d="M3 13h8V3H3zm10 8h8V11h-8zM3 21h8v-6H3zm10-18v6h8V3z"/>',
  groups: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  commands: '<path d="m4 17 6-6-6-6M12 19h8"/>',
  users: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  system: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
  logs: '<path d="M15 12h-5M15 8h-5M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  crown: '<path d="M11.56 3.27a.5.5 0 0 1 .88 0l2.95 5.6a1 1 0 0 0 1.52.29L21.18 5.5a.5.5 0 0 1 .8.52l-2.83 10.25a1 1 0 0 1-.96.73H5.81a1 1 0 0 1-.96-.73L2.02 6.02a.5.5 0 0 1 .8-.52l4.27 3.66a1 1 0 0 0 1.52-.29zM5 21h14"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  send: '<path d="M14.54 21.69a.5.5 0 0 0 .93-.03l6.5-19a.5.5 0 0 0-.64-.64l-19 6.5a.5.5 0 0 0-.03.93l7.93 3.18a2 2 0 0 1 1.11 1.11zM21.85 2.15 10.91 13.09"/>',
  trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
  db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  power: '<path d="M12 2v10M18.4 6.6a9 9 0 1 1-12.77.04"/>',
  phone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
  package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73zM12 22V12M3.3 7 12 12l8.7-5"/>'
}
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`

// ================= api =================
async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : {},
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'same-origin'
  })
  if (res.status === 401 && url !== '/api/login') {
    renderLogin()
    throw new Error('Sesi berakhir, silakan login lagi')
  }
  const type = res.headers.get('content-type') || ''
  const data = type.includes('json') ? await res.json() : await res.blob()
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
  return data
}

function toast(msg, err = false) {
  const el = document.createElement('div')
  el.className = `toast${err ? ' err' : ''}`
  el.textContent = msg
  $('#toasts').append(el)
  setTimeout(() => el.remove(), 3800)
}

function modal({ title, body = '', confirm = 'OK', cancel = 'Batal', danger = false }) {
  return new Promise((resolve) => {
    const back = document.createElement('div')
    back.className = 'modal-back'
    back.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><h3>${esc(title)}</h3><div class="muted">${body}</div><div class="actions"><button class="btn" data-a="no">${esc(cancel)}</button><button class="btn ${danger ? 'danger' : 'primary'}" data-a="yes">${esc(confirm)}</button></div></div>`
    const close = (v) => { back.remove(); resolve(v) }
    back.addEventListener('click', (e) => {
      if (e.target === back || e.target.dataset.a === 'no') close(false)
      if (e.target.dataset.a === 'yes') close($('.modal', back).querySelector('input,textarea,select')?.value ?? true)
    })
    document.body.append(back)
    $('.modal input, .modal textarea', back)?.focus()
  })
}

const toggle = (attrs, checked) => `<label class="switch"><input type="checkbox" ${attrs} ${checked ? 'checked' : ''}><span></span></label>`
const switchRow = (title, desc, attrs, checked) => `<div class="switch-row"><div class="grow"><div class="t">${esc(title)}</div>${desc ? `<div class="d">${esc(desc)}</div>` : ''}</div>${toggle(attrs, checked)}</div>`
const avatarHtml = (name, src, cls = '') => `<div class="avatar ${cls}">${esc(initials(name))}${src ? `<img src="${esc(src)}" alt="" loading="lazy" onerror="this.remove()">` : ''}</div>`
const empty = (ic, title, text) => `<div class="empty">${icon(ic)}<h4>${esc(title)}</h4><div>${esc(text)}</div></div>`

// ================= state =================
const state = { status: null, botName: 'Bitch Bot', es: null, logs: [], logListeners: new Set(), cmdListeners: new Set(), groupsCount: null }

const CONN = {
  open: ['on', 'Terhubung'], connecting: ['wait', 'Menyambung'], qr: ['wait', 'Scan QR'], pairing: ['wait', 'Menunggu pairing'],
  close: ['off', 'Terputus'], logged_out: ['off', 'Belum login'], idle: ['wait', 'Memulai']
}
const connPill = (s) => { const [d, t] = CONN[s?.connection] || CONN.idle; return `<span class="pill"><span class="dot ${d}"></span><span class="txt">${t}</span></span>` }

function startEvents() {
  state.es?.close()
  const es = new EventSource('/api/events')
  state.es = es
  es.addEventListener('status', (e) => {
    state.status = JSON.parse(e.data)
    const pill = $('#conn-pill')
    if (pill) pill.innerHTML = connPill(state.status)
    if (route().page === 'dashboard') renderConnectCard()
  })
  es.addEventListener('log', (e) => {
    const entry = JSON.parse(e.data)
    state.logs.push(entry)
    if (state.logs.length > 1500) state.logs.splice(0, 300)
    state.logListeners.forEach((fn) => fn(entry))
  })
  es.addEventListener('command', (e) => state.cmdListeners.forEach((fn) => fn(JSON.parse(e.data))))
}

// ================= routing =================
const NAV = [
  { section: 'Utama' },
  { page: 'dashboard', label: 'Dashboard', icon: 'dashboard', hash: '#/' },
  { page: 'groups', label: 'Grup', icon: 'groups', hash: '#/groups', count: true },
  { page: 'commands', label: 'Modul & Perintah', icon: 'commands', hash: '#/commands' },
  { page: 'users', label: 'Pengguna', icon: 'users', hash: '#/users' },
  { section: 'Pengaturan' },
  { page: 'settings', label: 'Pengaturan Bot', icon: 'settings', hash: '#/settings' },
  { page: 'system', label: 'Sistem & Database', icon: 'system', hash: '#/system' },
  { page: 'logs', label: 'Log', icon: 'logs', hash: '#/logs' }
]
const TITLES = { dashboard: 'Dashboard', groups: 'Grup', group: 'Pengaturan Grup', commands: 'Modul & Perintah', users: 'Pengguna', settings: 'Pengaturan Bot', system: 'Sistem & Database', logs: 'Log' }

function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent)
  if (!parts.length) return { page: 'dashboard' }
  if (parts[0] === 'groups' && parts[1]) return { page: 'group', id: parts[1] }
  return { page: TITLES[parts[0]] ? parts[0] : 'dashboard' }
}

let cleanup = []
function onLeave(fn) { cleanup.push(fn) }

async function render() {
  cleanup.forEach((fn) => fn())
  cleanup = []
  if (!$('.layout')) renderLayout()
  const r = route()
  $$('.nav a').forEach((a) => a.classList.toggle('active', a.dataset.page === (r.page === 'group' ? 'groups' : r.page)))
  $('.layout').classList.remove('nav-open')
  $('#page-title').textContent = TITLES[r.page]
  $('#crumbs').textContent = r.page === 'group' ? 'Grup /' : state.botName
  const view = $('#view')
  view.innerHTML = '<div class="boot" style="height:40vh"><div class="spinner"></div></div>'
  view.classList.remove('content')
  void view.offsetWidth
  view.classList.add('content')
  try {
    await PAGES[r.page](view, r)
  } catch (err) {
    view.innerHTML = `<div class="alert err">${icon('alert')}<div><b>Gagal memuat halaman.</b><br>${esc(err.message)}</div></div>`
  }
}

function renderLayout() {
  $('#app').innerHTML = `
  <div class="layout">
    <aside class="sidebar">
      <div class="brand"><img src="assets/logo.svg" alt=""><div><b>${esc(state.botName)}</b><small>WhatsApp Bot Dashboard</small></div></div>
      <nav class="nav">
        ${NAV.map((n) => n.section ? `<div class="nav-label">${n.section}</div>` : `<a href="${n.hash}" data-page="${n.page}">${icon(n.icon)}<span>${n.label}</span>${n.count ? '<span class="count" id="nav-groups">·</span>' : ''}</a>`).join('')}
      </nav>
      <div class="sidebar-foot"><div class="me" id="me-box"><div class="avatar">B</div><div class="ellipsis"><b>Belum terhubung</b><div class="faint small">-</div></div></div></div>
    </aside>
    <div class="main">
      <header class="topbar">
        <button class="btn icon ghost menu-btn" id="menu-btn" aria-label="Menu">${icon('menu')}</button>
        <div><div class="crumbs" id="crumbs"></div><h1 id="page-title"></h1></div>
        <div class="spacer"></div>
        <div id="conn-pill">${connPill(state.status)}</div>
        <button class="btn icon ghost" id="theme-btn" aria-label="Ganti tema">${icon('sun')}</button>
        <button class="btn icon ghost" id="logout-btn" aria-label="Keluar" title="Keluar">${icon('logout')}</button>
      </header>
      <main id="view" class="content"></main>
    </div>
  </div>`
  $('#menu-btn').onclick = () => $('.layout').classList.toggle('nav-open')
  $('#theme-btn').onclick = () => {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    const next = cur === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('theme', next) } catch {}
    $('#theme-btn').innerHTML = icon(next === 'dark' ? 'sun' : 'moon')
  }
  $('#logout-btn').onclick = async () => { await api('POST', '/api/logout'); state.es?.close(); renderLogin() }
}

function updateMe(status) {
  const box = $('#me-box')
  if (!box) return
  const me = status?.me
  box.innerHTML = me ? `${avatarHtml(me.name || state.botName)}<div class="ellipsis"><b>${esc(me.name || state.botName)}</b><div class="faint small">+${esc(String(me.id || '').split('@')[0])}</div></div>` : `<div class="avatar">?</div><div class="ellipsis"><b>Belum terhubung</b><div class="faint small">Login di Dashboard</div></div>`
}

// ================= login =================
function renderLogin() {
  state.es?.close()
  $('#app').innerHTML = `
  <div class="login"><form class="card" id="login-form">
    <div class="brand"><img src="assets/logo.svg" alt=""><div><b>${esc(state.botName)}</b><small>WhatsApp Bot Dashboard</small></div></div>
    <h2>Masuk</h2><p class="muted" style="margin:0 0 20px">Password ada di <code>config/config.json</code> → <code>dashboard.password</code> (juga dicetak di console saat start pertama).</p>
    <div class="field"><label for="pw">Password</label><input class="input" id="pw" type="password" autocomplete="current-password" required autofocus></div>
    <div id="login-err" class="small" style="color:var(--red);min-height:20px;margin:8px 0"></div>
    <button class="btn primary" style="width:100%">Masuk</button>
  </form></div>`
  $('#login-form').onsubmit = async (e) => {
    e.preventDefault()
    try {
      await api('POST', '/api/login', { password: $('#pw').value })
      boot()
    } catch (err) { $('#login-err').textContent = err.message }
  }
}

// ================= pages =================
const PAGES = {}

// ---------- Dashboard ----------
function chartSvg(series) {
  const W = 640, H = 220, pad = { l: 34, r: 8, t: 10, b: 26 }
  const max = Math.max(5, ...series.map((d) => Math.max(d.messages, d.commands)))
  const step = (W - pad.l - pad.r) / series.length
  const bw = Math.max(4, step / 2 - 3)
  const y = (v) => H - pad.b - (v / max) * (H - pad.t - pad.b)
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f))
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Grafik pesan dan perintah 14 hari">`
  for (const t of ticks) s += `<line class="grid-line" x1="${pad.l}" x2="${W - pad.r}" y1="${y(t)}" y2="${y(t)}"/><text class="axis" x="${pad.l - 6}" y="${y(t) + 3}" text-anchor="end">${t}</text>`
  series.forEach((d, i) => {
    const x = pad.l + i * step + step / 2
    s += `<rect class="bar-m" x="${x - bw - 1}" y="${y(d.messages)}" width="${bw}" height="${H - pad.b - y(d.messages)}" rx="3"><title>${d.date}: ${d.messages} pesan</title></rect>`
    s += `<rect class="bar-c" x="${x + 1}" y="${y(d.commands)}" width="${bw}" height="${H - pad.b - y(d.commands)}" rx="3"><title>${d.date}: ${d.commands} perintah</title></rect>`
    if (i % 2 === 0) s += `<text class="axis" x="${x}" y="${H - 8}" text-anchor="middle">${d.date.slice(8)}/${d.date.slice(5, 7)}</text>`
  })
  return s + '</svg>'
}

function renderConnectCard() {
  const box = $('#connect-card')
  if (!box) return
  const s = state.status || {}
  updateMe(s)
  if (s.connection === 'open') {
    box.innerHTML = `<div class="card-head"><h3>Koneksi WhatsApp</h3><div class="spacer"></div><span class="badge green">● Online</span></div>
      <div class="row" style="gap:14px">${avatarHtml(s.me?.name || state.botName, '', 'lg')}<div class="grow" style="flex:1;min-width:0"><div style="font-weight:800;font-size:16px">${esc(s.me?.name || state.botName)}</div><div class="muted mono">+${esc(String(s.me?.id || '').split('@')[0])}</div><div class="faint small">Terhubung sejak ${fmtDate(s.since)}</div></div></div>
      <div class="row" style="margin-top:16px"><button class="btn sm" data-act="reconnect">${icon('refresh')} Sambung ulang</button><button class="btn sm danger" data-act="logout">${icon('logout')} Logout WhatsApp</button></div>`
  } else if (s.connection === 'qr' && s.qr) {
    box.innerHTML = `<div class="card-head"><h3>Login dengan QR</h3><div class="spacer"></div><span class="badge amber">Menunggu scan</span></div>
      <div class="connect-box"><div class="qr"><img src="${esc(s.qr)}" alt="QR login WhatsApp"></div><div><ol class="muted" style="padding-left:18px;margin:0;line-height:1.9"><li>Buka WhatsApp di HP</li><li>Ketuk ⋮ / Setelan → <b>Perangkat tertaut</b></li><li>Ketuk <b>Tautkan perangkat</b>, lalu scan QR ini</li></ol><p class="faint small">QR diperbarui otomatis. Ingin pakai kode? Ubah <i>Metode login</i> di Sistem.</p></div></div>`
  } else {
    const code = s.pairingCode
    box.innerHTML = `<div class="card-head"><h3>Hubungkan WhatsApp</h3><div class="spacer"></div>${connPill(s)}</div>
      ${code ? `<p class="muted" style="margin-top:0">Masukkan kode ini di WhatsApp → <b>Perangkat tertaut</b> → <b>Tautkan perangkat</b> → <b>Tautkan dengan nomor telepon</b>:</p><div class="pair-code">${esc(code)}</div><p class="faint small">Kode berlaku beberapa menit. Bila kedaluwarsa, minta kode baru.</p>` : `<p class="muted" style="margin-top:0">Masukkan nomor WhatsApp yang akan dijadikan bot (pakai kode negara, tanpa + atau spasi).</p>`}
      <form class="input-group" id="pair-form" style="margin-top:12px;max-width:440px"><input class="input" id="pair-number" placeholder="628123456789" inputmode="numeric" value="${esc(s.pairingNumber || '')}"><button class="btn primary">${icon('phone')} ${code ? 'Kode baru' : 'Minta kode'}</button></form>
      ${s.lastDisconnect ? `<p class="faint small">Terakhir terputus: kode ${esc(s.lastDisconnect.code || '-')} ${esc(s.lastDisconnect.reason || '')}</p>` : ''}`
    $('#pair-form').onsubmit = async (e) => {
      e.preventDefault()
      const btn = e.submitter
      btn.disabled = true
      try { await api('POST', '/api/connection/pair', { number: $('#pair-number').value }); toast('Kode pairing dibuat') } catch (err) { toast(err.message, true) } finally { btn.disabled = false }
    }
  }
  $$('[data-act]', box).forEach((b) => (b.onclick = async () => {
    if (b.dataset.act === 'logout' && !(await modal({ title: 'Logout WhatsApp?', body: 'Sesi akan dihapus (dicadangkan di data/session-backup) dan bot perlu ditautkan ulang.', confirm: 'Logout', danger: true }))) return
    try { await api('POST', `/api/connection/${b.dataset.act}`); toast('Diproses') } catch (err) { toast(err.message, true) }
  }))
}

PAGES.dashboard = async (view) => {
  const o = await api('GET', '/api/overview')
  state.status = o.status
  state.botName = o.settings.botName
  const src = o.counts.sources
  view.innerHTML = `
    ${o.dbError ? `<div class="alert err">${icon('alert')}<div><b>Database utama gagal terhubung</b> — sementara memakai JSON. ${esc(o.dbError)} <a class="link-btn" href="#/system">Perbaiki di Sistem</a></div></div>` : ''}
    ${!o.settings.owners?.length ? `<div class="alert warn">${icon('alert')}<div><b>Owner belum diatur.</b> Perintah owner tidak bisa dipakai siapa pun. <a class="link-btn" href="#/settings">Atur nomor owner</a></div></div>` : ''}
    <div class="grid grid-4">
      <div class="card stat"><div class="ico tone-accent">${icon('groups')}</div><div><div class="label">Grup</div><div class="value">${fmtNum(o.counts.groups)}</div><div class="hint">diikuti bot</div></div></div>
      <div class="card stat"><div class="ico tone-violet">${icon('users')}</div><div><div class="label">Pengguna</div><div class="value">${fmtNum(o.counts.users)}</div><div class="hint">${fmtNum(o.counts.premium)} premium · ${fmtNum(o.counts.banned)} diblokir</div></div></div>
      <div class="card stat"><div class="ico tone-teal">${icon('commands')}</div><div><div class="label">Perintah aktif</div><div class="value">${fmtNum(o.counts.commands)}</div><div class="hint">native ${src.native || 0} · vanXone ${src.vanxone || 0} · Rubby ${src.rubby || 0}</div></div></div>
      <div class="card stat"><div class="ico tone-amber">${icon('clock')}</div><div><div class="label">Uptime</div><div class="value">${fmtDur(o.uptime)}</div><div class="hint">${fmtNum(o.runtime.messages)} pesan · ${fmtNum(o.runtime.commands)} perintah</div></div></div>
    </div>
    <div class="grid grid-main" style="margin-top:18px">
      <div class="stack">
        <div class="card" id="connect-card"></div>
        <div class="card"><div class="card-head"><h3>Aktivitas 14 hari</h3><div class="spacer"></div><div class="legend"><span><i style="background:var(--violet)"></i>Pesan</span><span><i style="background:var(--accent)"></i>Perintah</span></div></div>${chartSvg(o.daily)}</div>
        <div class="card"><div class="card-head"><h3>Info bot</h3></div>
          <div class="info-grid">
            <div><div class="k">Nama bot</div><div class="v">${esc(o.settings.botName)}</div></div>
            <div><div class="k">Mode</div><div class="v">${esc(o.settings.mode)}</div></div>
            <div><div class="k">Prefix</div><div class="v mono">${esc(o.settings.prefixes.join(' '))}</div></div>
            <div><div class="k">Database</div><div class="v">${esc(o.database.driver)} <span class="faint small">(${fmtNum(Object.values(o.database.collections).reduce((a, b) => a + b, 0))} dok)</span></div></div>
            <div><div class="k">Kartu welcome</div><div class="v">${esc(o.cardEngine)}</div></div>
            <div><div class="k">Bentrok nama</div><div class="v">${fmtNum(o.counts.conflicts)} perintah</div></div>
            <div><div class="k">Node.js</div><div class="v">${esc(o.system.node)}</div></div>
            <div><div class="k">RAM bot</div><div class="v">${fmtBytes(o.system.rss)}</div></div>
            <div><div class="k">Sistem</div><div class="v">${esc(o.system.platform)}</div></div>
          </div>
        </div>
      </div>
      <div class="stack">
        <div class="card"><div class="card-head"><h3>Perintah terpopuler</h3></div>
          ${o.top.length ? `<div class="bar-list">${o.top.map((t) => `<div class="item"><span class="mono ellipsis">${esc(t.name)}</span><div class="track"><div class="fill" style="width:${(t.count / o.top[0].count) * 100}%"></div></div><span class="small faint" style="text-align:right">${fmtNum(t.count)}</span></div>`).join('')}</div>` : empty('zap', 'Belum ada data', 'Statistik muncul setelah perintah dipakai.')}
        </div>
        <div class="card"><div class="card-head"><h3>Aktivitas langsung</h3><div class="spacer"></div><span class="dot on"></span></div><div class="feed" id="feed">${o.recent.length ? '' : '<div class="faint small" id="feed-empty">Menunggu perintah masuk...</div>'}</div></div>
      </div>
    </div>`
  renderConnectCard()
  const feed = $('#feed')
  const addFeed = (c, top = true) => {
    $('#feed-empty')?.remove()
    const el = document.createElement('div')
    el.className = 'entry'
    el.innerHTML = `<span class="badge ${c.ok ? 'green' : 'red'}">${c.ok ? 'OK' : 'ERR'}</span><span class="mono ellipsis" style="flex:1">${esc(c.name)}</span><span class="badge gray">${esc(c.source)}</span><span class="faint small nowrap">${esc(c.ms)}ms</span>`
    el.title = `${c.sender} · ${c.chat} · ${fmtDate(c.time)}`
    top ? feed.prepend(el) : feed.append(el)
    while (feed.children.length > 12) feed.lastChild.remove()
  }
  o.recent.forEach((c) => addFeed(c, false))
  state.cmdListeners.add(addFeed)
  onLeave(() => state.cmdListeners.delete(addFeed))
}

// ---------- Groups ----------
PAGES.groups = async (view) => {
  const load = async (refresh) => api('GET', `/api/groups${refresh ? '?refresh=1' : ''}`)
  let data = await load()
  const draw = () => {
    const q = ($('#g-search')?.value || '').toLowerCase()
    const list = data.groups.filter((g) => !q || g.subject.toLowerCase().includes(q) || g.id.includes(q))
    $('#nav-groups').textContent = data.groups.length
    $('#g-list').innerHTML = list.length ? list.map((g) => `
      <a class="card group-card" href="#/groups/${encodeURIComponent(g.id)}">
        <div class="top">${avatarHtml(g.subject, data.connected ? `/api/groups/${encodeURIComponent(g.id)}/picture` : '', 'sq')}<div class="ellipsis" style="flex:1"><div class="name ellipsis">${esc(g.subject)}</div><div class="faint small">${fmtNum(g.size)} anggota</div></div></div>
        <div class="meta">
          ${g.botAdmin ? '<span class="badge green">Bot admin</span>' : '<span class="badge gray">Bot member</span>'}
          ${g.settings.botEnabled === false ? '<span class="badge red">Bot mati</span>' : ''}
          ${g.settings.welcome ? '<span class="badge teal">Welcome</span>' : ''}
          ${g.settings.antilink && g.settings.antilink !== 'off' ? '<span class="badge amber">Antilink</span>' : ''}
          ${g.settings.nsfw ? '<span class="badge violet">NSFW</span>' : ''}
          ${g.announce ? '<span class="badge sky">Tertutup</span>' : ''}
        </div>
      </a>`).join('') : `<div class="card" style="grid-column:1/-1">${empty('groups', data.connected ? 'Tidak ada grup' : 'Bot belum terhubung', data.connected ? 'Bot belum bergabung ke grup mana pun, atau pencarian tidak cocok.' : 'Hubungkan WhatsApp di halaman Dashboard untuk melihat grup.')}</div>`
  }
  view.innerHTML = `
    <div class="toolbar">
      <div class="search">${icon('search')}<input class="input" id="g-search" placeholder="Cari nama atau id grup..."></div>
      <div class="spacer" style="flex:1"></div>
      <button class="btn" id="g-join">${icon('link')} Masuk via link</button>
      <button class="btn" id="g-refresh">${icon('refresh')} Muat ulang</button>
    </div>
    <div class="group-grid" id="g-list"></div>`
  draw()
  $('#g-search').oninput = debounce(draw, 150)
  $('#g-refresh').onclick = async () => { data = await load(true); draw(); toast('Daftar grup diperbarui') }
  $('#g-join').onclick = async () => {
    const link = await modal({ title: 'Masuk grup lewat link', body: '<input class="input" placeholder="https://chat.whatsapp.com/...">', confirm: 'Masuk' })
    if (!link || link === true) return
    try { await api('POST', '/api/groups/join', { link }); data = await load(true); draw(); toast('Bot bergabung ke grup') } catch (err) { toast(err.message, true) }
  }
}

PAGES.group = async (view, { id }) => {
  let d = await api('GET', `/api/groups/${encodeURIComponent(id)}`)
  const enc = encodeURIComponent(id)
  let tab = sessionStorage.getItem('gtab') || 'general'
  const s = () => d.settings
  const save = async (patch, silent) => {
    try { const r = await api('PATCH', `/api/groups/${enc}/settings`, patch); d.settings = r.settings; if (!silent) toast('Tersimpan') } catch (err) { toast(err.message, true) }
  }
  $('#crumbs').textContent = 'Grup / ' + d.summary.subject

  const tabs = { general: 'Umum', welcome: 'Welcome & Goodbye', moderation: 'Moderasi', respon: 'Auto-respon', members: `Anggota (${d.participants.length})`, actions: 'Aksi' }
  const body = () => {
    const st = s()
    switch (tab) {
      case 'general':
        return `<div class="grid grid-2"><div class="card"><div class="card-head"><h3>Perilaku bot</h3></div>
          ${switchRow('Bot aktif di grup ini', 'Jika mati, hanya admin & owner yang bisa memakai bot', 'data-k="botEnabled"', st.botEnabled)}
          ${switchRow('Hanya admin', 'Anggota biasa tidak bisa memakai perintah', 'data-k="onlyAdmin"', st.onlyAdmin)}
          ${switchRow('Izinkan NSFW', 'Perintah kategori NSFW boleh dipakai', 'data-k="nsfw"', st.nsfw)}
          ${switchRow('Auto stiker', 'Gambar/video pendek otomatis dijadikan stiker', 'data-k="autoSticker"', st.autoSticker)}
          ${switchRow('Notifikasi admin', 'Umumkan saat ada promote / demote', 'data-k="promoteNotify"', st.promoteNotify)}
          </div>
          <div class="card"><div class="card-head"><h3>Perintah nonaktif di grup ini</h3></div><p class="card-sub">Perintah di sini tidak bisa dipakai anggota (owner tetap bisa).</p>
          <div class="chips" id="dis-chips">${st.disabledCommands.map((c) => `<span class="chip">${esc(c)} <span class="x" data-del="${esc(c)}">✕</span></span>`).join('') || '<span class="faint small">Tidak ada</span>'}</div>
          <form class="input-group" id="dis-form" style="margin-top:14px"><input class="input" placeholder="nama perintah, mis. tiktok"><button class="btn">${icon('plus')} Tambah</button></form>
          <div style="margin-top:22px" class="info-grid">
            <div><div class="k">Pesan tercatat</div><div class="v">${fmtNum(st.stats?.messages)}</div></div>
            <div><div class="k">Perintah dipakai</div><div class="v">${fmtNum(st.stats?.commands)}</div></div>
            <div><div class="k">Bot admin</div><div class="v">${d.summary.botAdmin ? 'Ya' : 'Tidak'}</div></div>
          </div></div></div>`
      case 'welcome':
        return `<div class="grid grid-2">
          <div class="card"><div class="card-head"><h3>Pengaturan</h3></div>
            ${switchRow('Welcome', 'Kirim sambutan saat anggota baru masuk', 'data-k="welcome"', st.welcome)}
            ${switchRow('Goodbye', 'Kirim pesan saat anggota keluar', 'data-k="goodbye"', st.goodbye)}
            ${switchRow('Kartu gambar (discord-canvas)', 'Matikan untuk mengirim teks saja', 'data-k="welcomeCard"', st.welcomeCard)}
            <div class="field" style="margin-top:14px"><label>Teks welcome</label><textarea class="textarea" id="wtext" placeholder="${esc(d.defaults.welcomeText)}">${esc(st.welcomeText)}</textarea></div>
            <div class="field" style="margin-top:12px"><label>Teks goodbye</label><textarea class="textarea" id="btext" placeholder="${esc(d.defaults.goodbyeText)}">${esc(st.goodbyeText)}</textarea><div class="help">Kosongkan untuk memakai teks default dari Pengaturan Bot.</div></div>
            <div class="chips placeholder-chips" style="margin-top:10px">${['@user', '@name', '@group', '@count', '@desc', '@number'].map((p) => `<span class="chip" data-ph="${p}">${p}</span>`).join('')}</div>
            <div class="field" style="margin-top:14px"><label>Latar kartu (URL gambar 1024×450)</label><input class="input" id="wbg" value="${esc(st.cardBackground)}" placeholder="https://... (kosong = default)"></div>
            <div class="row" style="margin-top:16px"><button class="btn primary" id="wsave">Simpan</button><button class="btn" id="wtest">${icon('send')} Kirim tes ke grup</button></div>
          </div>
          <div class="card"><div class="card-head"><h3>Pratinjau kartu</h3><div class="spacer"></div><div class="row tight"><button class="chip active" data-pv="welcome">Welcome</button><button class="chip" data-pv="goodbye">Goodbye</button></div></div>
            <img class="preview-img" id="pv-img" alt="Pratinjau kartu welcome">
            <p class="faint small">Kartu dibuat dengan paket <b>discord-canvas</b>. Avatar & nama memakai profil bot sebagai contoh.</p>
          </div></div>`
      case 'moderation':
        return `<div class="grid grid-2">
          <div class="card"><div class="card-head"><h3>Anti-link</h3></div>
            <div class="form-grid"><div class="field"><label>Mode</label><select class="select" data-sel="antilink"><option value="off">Mati</option><option value="wa">Link grup/saluran WA</option><option value="all">Semua link</option></select></div>
            <div class="field"><label>Aksi</label><select class="select" data-sel="antilinkAction"><option value="delete">Hapus pesan</option><option value="warn">Hapus + peringatan</option><option value="kick">Keluarkan</option></select></div>
            <div class="field"><label>Batas peringatan</label><input class="input" type="number" min="1" max="20" data-num="warnLimit" value="${esc(st.warnLimit)}"></div></div>
            <p class="faint small">Admin grup tidak terkena anti-link. Bot harus admin untuk menghapus pesan & mengeluarkan anggota.</p>
          </div>
          <div class="card"><div class="card-head"><h3>Anti kata kasar</h3></div>
            ${switchRow('Aktifkan', 'Pesan berisi kata terlarang dihapus/diperingatkan', 'data-k="antiBadword"', st.antiBadword)}
            <div class="chips" style="margin-top:12px">${st.badwords.map((w) => `<span class="chip">${esc(w)} <span class="x" data-bw="${esc(w)}">✕</span></span>`).join('') || '<span class="faint small">Belum ada kata</span>'}</div>
            <form class="input-group" id="bw-form" style="margin-top:12px"><input class="input" placeholder="kata1, kata2"><button class="btn">${icon('plus')} Tambah</button></form>
          </div>
          <div class="card" style="grid-column:1/-1"><div class="card-head"><h3>Peringatan aktif</h3></div>
            ${Object.keys(st.warns || {}).length ? Object.entries(st.warns).map(([n, c]) => `<div class="list-item"><span class="mono grow">+${esc(n)}</span><span class="badge amber">${c}/${esc(st.warnLimit)}</span><button class="btn sm ghost" data-unwarn="${esc(n)}">Reset</button></div>`).join('') : '<div class="faint small">Tidak ada anggota dengan peringatan.</div>'}
          </div></div>`
      case 'respon':
        return `<div class="card"><div class="card-head"><h3>Auto-respon grup</h3></div><p class="card-sub">Bot membalas otomatis saat pesan cocok dengan kata kunci. Placeholder: @user @name</p>
          ${st.autoResponses.length ? st.autoResponses.map((r, i) => `<div class="list-item"><span class="badge ${r.exact ? 'gray' : 'violet'}">${r.exact ? 'sama persis' : 'mengandung'}</span><div class="grow"><b class="mono">${esc(r.trigger)}</b><div class="muted small ellipsis">${esc(r.response)}</div></div><button class="btn sm icon ghost" data-rdel="${i}" aria-label="Hapus">${icon('trash')}</button></div>`).join('') : '<div class="faint small">Belum ada auto-respon.</div>'}
          <form id="r-form" class="form-grid" style="margin-top:16px"><div class="field"><label>Kata kunci</label><input class="input" name="trigger" required></div><div class="field"><label>Cocok jika</label><select class="select" name="exact"><option value="1">Sama persis</option><option value="0">Mengandung</option></select></div><div class="field full"><label>Balasan</label><textarea class="textarea" name="response" required></textarea></div><div><button class="btn primary">${icon('plus')} Tambah</button></div></form></div>`
      case 'members':
        return `<div class="card"><div class="toolbar"><div class="search">${icon('search')}<input class="input" id="m-search" placeholder="Cari nomor / nama..."></div></div><div class="table-wrap"><table><thead><tr><th>Anggota</th><th>Status</th><th>Peringatan</th><th></th></tr></thead><tbody id="m-body"></tbody></table></div></div>`
      case 'actions':
        return `<div class="grid grid-2">
          <div class="card"><div class="card-head"><h3>Kirim pesan</h3></div>
            <textarea class="textarea" id="msg-text" placeholder="Tulis pesan untuk grup ini..."></textarea>
            <div class="row" style="margin-top:12px"><label class="row tight small">${toggle('id="msg-tag"', false)} <span>Hidetag (tag semua diam-diam)</span></label><div style="flex:1"></div><button class="btn primary" id="msg-send">${icon('send')} Kirim</button></div>
          </div>
          <div class="card"><div class="card-head"><h3>Kelola grup</h3></div>
            <div class="row">
              <button class="btn" data-ga="open">Buka grup</button><button class="btn" data-ga="close">Tutup grup</button>
              <button class="btn" data-ga="invite">${icon('link')} Link undangan</button><button class="btn" data-ga="refresh">${icon('refresh')} Segarkan data</button>
            </div>
            <div id="invite-out" class="mono small" style="margin-top:12px"></div>
            <hr style="border:0;border-top:1px solid var(--border);margin:18px 0">
            <button class="btn danger" data-ga="leave">${icon('logout')} Keluarkan bot dari grup</button>
          </div></div>`
    }
  }

  const drawMembers = () => {
    const q = ($('#m-search')?.value || '').toLowerCase()
    const rows = d.participants.filter((p) => !q || p.number.includes(q) || p.name.toLowerCase().includes(q))
      .sort((a, b) => (b.admin ? 1 : 0) - (a.admin ? 1 : 0))
    $('#m-body').innerHTML = rows.map((p) => `<tr>
      <td><div class="row">${avatarHtml(p.name || p.number)}<div><b>${esc(p.name || '-')}</b><div class="mono faint small">+${esc(p.number)}</div></div></div></td>
      <td>${p.admin === 'superadmin' ? '<span class="badge amber">Pembuat</span>' : p.admin ? '<span class="badge green">Admin</span>' : '<span class="badge gray">Anggota</span>'}</td>
      <td>${p.warns ? `<span class="badge amber">${p.warns}</span>` : '<span class="faint">-</span>'}</td>
      <td class="nowrap" style="text-align:right">${d.summary.botAdmin && p.admin !== 'superadmin' ? `<button class="btn sm" data-pa="${p.admin ? 'demote' : 'promote'}" data-pid="${esc(p.id)}">${p.admin ? 'Copot admin' : 'Jadikan admin'}</button> <button class="btn sm danger" data-pa="remove" data-pid="${esc(p.id)}">Keluarkan</button>` : ''}</td></tr>`).join('') || `<tr><td colspan="4">${empty('users', 'Tidak ada anggota', 'Bot belum terhubung atau pencarian tidak cocok.')}</td></tr>`
    $$('[data-pa]').forEach((b) => (b.onclick = async () => {
      const act = b.dataset.pa
      if (act === 'remove' && !(await modal({ title: 'Keluarkan anggota?', body: 'Anggota akan dikeluarkan dari grup.', confirm: 'Keluarkan', danger: true }))) return
      try { await api('POST', `/api/groups/${enc}/action`, { action: act, participant: b.dataset.pid }); d = await api('GET', `/api/groups/${enc}`); drawMembers(); toast('Berhasil') } catch (err) { toast(err.message, true) }
    }))
  }

  const preview = async (kind) => {
    const img = $('#pv-img')
    if (!img) return
    img.style.opacity = 0.5
    try {
      const blob = await api('POST', `/api/groups/${enc}/preview/${kind}`, { background: $('#wbg')?.value ?? undefined })
      if (img.src.startsWith('blob:')) URL.revokeObjectURL(img.src)
      img.src = URL.createObjectURL(blob)
    } catch (err) { toast(err.message, true) } finally { img.style.opacity = 1 }
  }

  const draw = () => {
    view.innerHTML = `
      <div class="card" style="margin-bottom:18px"><div class="row" style="gap:16px">
        <a class="btn icon ghost" href="#/groups" aria-label="Kembali">${icon('back')}</a>
        ${avatarHtml(d.summary.subject, `/api/groups/${enc}/picture`, 'lg sq')}
        <div style="flex:1;min-width:0"><h2 style="font-size:20px" class="ellipsis">${esc(d.summary.subject)}</h2><div class="faint mono small ellipsis">${esc(id)}</div>
          <div class="row tight" style="margin-top:6px"><span class="badge gray">${fmtNum(d.summary.size)} anggota</span>${d.summary.botAdmin ? '<span class="badge green">Bot admin</span>' : '<span class="badge amber">Bot bukan admin</span>'}${d.meta?.announce ? '<span class="badge sky">Tertutup</span>' : ''}</div></div>
      </div>${d.meta?.desc ? `<p class="muted small" style="margin:14px 0 0;white-space:pre-wrap;max-height:90px;overflow:auto">${esc(d.meta.desc)}</p>` : ''}</div>
      <div class="tabs">${Object.entries(tabs).map(([k, v]) => `<button class="tab ${k === tab ? 'active' : ''}" data-tab="${k}">${esc(v)}</button>`).join('')}</div>
      <div id="tab-body">${body()}</div>`
    bind()
  }

  const bind = () => {
    $$('[data-tab]').forEach((b) => (b.onclick = () => { tab = b.dataset.tab; sessionStorage.setItem('gtab', tab); draw() }))
    $$('input[data-k]').forEach((el) => (el.onchange = () => save({ [el.dataset.k]: el.checked })))
    $$('select[data-sel]').forEach((el) => { el.value = s()[el.dataset.sel]; el.onchange = () => save({ [el.dataset.sel]: el.value }) })
    $$('input[data-num]').forEach((el) => (el.onchange = () => save({ [el.dataset.num]: Number(el.value) })))
    $$('[data-del]').forEach((x) => (x.onclick = async () => { await save({ disabledCommands: s().disabledCommands.filter((c) => c !== x.dataset.del) }); draw() }))
    const dis = $('#dis-form')
    if (dis) dis.onsubmit = async (e) => { e.preventDefault(); const v = $('input', dis).value.trim().toLowerCase().replace(/^[./!#]/, ''); if (!v) return; await save({ disabledCommands: [...new Set([...s().disabledCommands, v])] }); draw() }
    $$('[data-bw]').forEach((x) => (x.onclick = async () => { await save({ badwords: s().badwords.filter((w) => w !== x.dataset.bw) }); draw() }))
    const bw = $('#bw-form')
    if (bw) bw.onsubmit = async (e) => { e.preventDefault(); const words = $('input', bw).value.split(',').map((w) => w.trim()).filter(Boolean); if (!words.length) return; await save({ badwords: [...s().badwords, ...words] }); draw() }
    $$('[data-unwarn]').forEach((b) => (b.onclick = async () => { const w = { ...s().warns }; delete w[b.dataset.unwarn]; await save({ warns: w }); draw() }))
    $$('[data-rdel]').forEach((b) => (b.onclick = async () => { const list = s().autoResponses.filter((_, i) => i !== Number(b.dataset.rdel)); await save({ autoResponses: list }); draw() }))
    const rf = $('#r-form')
    if (rf) rf.onsubmit = async (e) => {
      e.preventDefault()
      const f = new FormData(rf)
      const trigger = String(f.get('trigger')).trim().toLowerCase()
      const list = s().autoResponses.filter((r) => r.trigger !== trigger)
      list.push({ trigger, response: String(f.get('response')), exact: f.get('exact') === '1' })
      await save({ autoResponses: list }); draw()
    }
    if (tab === 'welcome') {
      let kind = 'welcome'
      let lastField = $('#wtext')
      $('#wtext').onfocus = () => (lastField = $('#wtext'))
      $('#btext').onfocus = () => (lastField = $('#btext'))
      $$('[data-ph]').forEach((c) => (c.onclick = () => { const f = lastField; const pos = f.selectionStart ?? f.value.length; f.value = f.value.slice(0, pos) + c.dataset.ph + f.value.slice(pos); f.focus() }))
      $$('[data-pv]').forEach((c) => (c.onclick = () => { kind = c.dataset.pv; $$('[data-pv]').forEach((x) => x.classList.toggle('active', x === c)); preview(kind) }))
      $('#wbg').onchange = () => preview(kind)
      $('#wsave').onclick = () => save({ welcomeText: $('#wtext').value, goodbyeText: $('#btext').value, cardBackground: $('#wbg').value.trim() })
      $('#wtest').onclick = async () => { try { await api('POST', `/api/groups/${enc}/test/${kind}`); toast('Pesan tes dikirim ke grup') } catch (err) { toast(err.message, true) } }
      preview(kind)
    }
    if (tab === 'members') { drawMembers(); $('#m-search').oninput = debounce(drawMembers, 150) }
    if (tab === 'actions') {
      $('#msg-send').onclick = async () => {
        try { await api('POST', `/api/groups/${enc}/message`, { text: $('#msg-text').value, hidetag: $('#msg-tag').checked }); $('#msg-text').value = ''; toast('Pesan terkirim') } catch (err) { toast(err.message, true) }
      }
      $$('[data-ga]').forEach((b) => (b.onclick = async () => {
        const action = b.dataset.ga
        if (action === 'leave' && !(await modal({ title: 'Keluarkan bot dari grup?', body: `Bot akan keluar dari <b>${esc(d.summary.subject)}</b>. Untuk masuk lagi butuh link undangan.`, confirm: 'Keluar', danger: true }))) return
        try {
          const r = await api('POST', `/api/groups/${enc}/action`, { action })
          if (action === 'invite') $('#invite-out').innerHTML = `<a href="${esc(r.link)}" target="_blank" rel="noopener">${esc(r.link)}</a>`
          else if (action === 'leave') { toast('Bot keluar dari grup'); location.hash = '#/groups'; return }
          else { d = await api('GET', `/api/groups/${enc}?refresh=1`); toast('Berhasil') }
        } catch (err) { toast(err.message, true) }
      }))
    }
  }
  if (!tabs[tab]) tab = 'general'
  draw()
}

// ---------- Commands ----------
PAGES.commands = async (view) => {
  let data = await api('GET', '/api/commands')
  const f = { q: '', cat: '', src: '', only: '' }
  const cats = () => {
    const m = {}
    for (const c of data.commands) if (c.active) m[c.category] = (m[c.category] || 0) + 1
    return Object.entries(m).sort((a, b) => b[1] - a[1])
  }
  const draw = () => {
    let rows = data.commands
    if (f.src) rows = rows.filter((c) => c.source === f.src)
    else rows = rows.filter((c) => c.active || f.only === 'conflict')
    if (f.cat) rows = rows.filter((c) => c.category === f.cat)
    if (f.only === 'disabled') rows = rows.filter((c) => c.disabled)
    if (f.only === 'conflict') rows = rows.filter((c) => c.providers.length > 1)
    if (f.q) rows = rows.filter((c) => c.name.includes(f.q) || c.aliases.some((a) => a.includes(f.q)) || c.description.toLowerCase().includes(f.q))
    const total = rows.length
    rows = rows.slice(0, 300)
    $('#c-count').textContent = `${fmtNum(total)} perintah${total > 300 ? ' (300 pertama ditampilkan, persempit pencarian)' : ''}`
    $('#c-body').innerHTML = rows.map((c) => `<tr>
      <td><div class="mono"><b>${esc(c.name)}</b></div>${c.aliases.length ? `<div class="faint small ellipsis" style="max-width:240px">${esc(c.aliases.slice(0, 6).join(', '))}${c.aliases.length > 6 ? '…' : ''}</div>` : ''}</td>
      <td class="muted small" style="max-width:360px">${esc(c.description || '-')}${c.usage ? `<div class="faint mono">${esc(c.usage)}</div>` : ''}</td>
      <td><span class="badge gray">${esc(c.category)}</span></td>
      <td>${c.providers.length > 1 ? `<select class="select" style="height:32px;width:auto" data-prov="${esc(c.name)}">${c.providers.map((p) => `<option ${p === (data.commands.find((x) => x.name === c.name && x.active)?.source || c.source) ? 'selected' : ''}>${esc(p)}</option>`).join('')}</select>` : `<span class="badge ${c.source === 'native' ? 'red' : c.source === 'vanxone' ? 'violet' : 'teal'}">${esc(c.source)}</span>`}</td>
      <td class="nowrap">${c.flags.owner ? '<span class="badge amber" title="Owner">👑</span> ' : ''}${c.flags.premium ? '<span class="badge violet" title="Premium">💎</span> ' : ''}${c.flags.admin ? '<span class="badge green" title="Admin grup">🛡️</span> ' : ''}${c.flags.group && !c.flags.admin ? '<span class="badge gray" title="Grup">👥</span>' : ''}</td>
      <td class="small faint" style="text-align:right">${fmtNum(c.uses)}</td>
      <td style="text-align:right">${toggle(`data-cmd="${esc(c.name)}" aria-label="Aktifkan ${esc(c.name)}"`, !c.disabled)}</td></tr>`).join('') || `<tr><td colspan="7">${empty('commands', 'Tidak ada perintah', 'Ubah filter atau kata pencarian.')}</td></tr>`
    $$('[data-cmd]').forEach((el) => (el.onchange = async () => {
      try { await api('PATCH', `/api/commands/${encodeURIComponent(el.dataset.cmd)}`, { disabled: !el.checked }); const row = data.commands.find((c) => c.name === el.dataset.cmd && c.active); if (row) row.disabled = !el.checked; toast(`${el.dataset.cmd} ${el.checked ? 'diaktifkan' : 'dinonaktifkan'}`) } catch (err) { toast(err.message, true); el.checked = !el.checked }
    }))
    $$('[data-prov]').forEach((el) => (el.onchange = async () => {
      try { await api('PATCH', `/api/commands/${encodeURIComponent(el.dataset.prov)}`, { provider: el.value }); data = await api('GET', '/api/commands'); toast(`${el.dataset.prov} → ${el.value}`) } catch (err) { toast(err.message, true) }
    }))
  }
  const c = data.counts
  view.innerHTML = `
    <div class="grid grid-4" style="margin-bottom:18px">
      <div class="card stat"><div class="ico tone-accent">${icon('zap')}</div><div><div class="label">Native</div><div class="value">${fmtNum(c.native)}</div><div class="hint">core bot (plugins/)</div></div></div>
      <div class="card stat"><div class="ico tone-violet">${icon('package')}</div><div><div class="label">vanXone</div><div class="value">${fmtNum(c.vanxone)}</div><div class="hint">packs/vanxone</div></div></div>
      <div class="card stat"><div class="ico tone-teal">${icon('package')}</div><div><div class="label">Rubby-MD</div><div class="value">${fmtNum(c.rubby)}</div><div class="hint">packs/rubby</div></div></div>
      <div class="card stat"><div class="ico tone-amber">${icon('alert')}</div><div><div class="label">Bentrok nama</div><div class="value">${fmtNum(data.commands.filter((x) => x.active && x.providers.length > 1).length)}</div><div class="hint">pilih sumbernya di tabel</div></div></div>
    </div>
    <div class="card">
      <div class="toolbar">
        <div class="search">${icon('search')}<input class="input" id="c-q" placeholder="Cari perintah, alias, deskripsi..."></div>
        <select class="select" id="c-src" style="width:auto"><option value="">Semua sumber (aktif)</option><option value="native">Native</option><option value="vanxone">vanXone</option><option value="rubby">Rubby</option></select>
        <select class="select" id="c-only" style="width:auto"><option value="">Semua status</option><option value="disabled">Nonaktif</option><option value="conflict">Bentrok nama</option></select>
        <div style="flex:1"></div><button class="btn" id="c-reload">${icon('refresh')} Muat ulang plugin</button>
      </div>
      <div class="chips" id="c-cats" style="margin-bottom:14px"></div>
      <div class="faint small" id="c-count" style="margin-bottom:8px"></div>
      <div class="table-wrap"><table><thead><tr><th>Perintah</th><th>Deskripsi</th><th>Kategori</th><th>Sumber</th><th>Akses</th><th style="text-align:right">Dipakai</th><th style="text-align:right">Aktif</th></tr></thead><tbody id="c-body"></tbody></table></div>
    </div>`
  $('#c-cats').innerHTML = `<button class="chip active" data-cat="">Semua</button>` + cats().map(([k, n]) => `<button class="chip" data-cat="${esc(k)}">${esc(k)} <small>${n}</small></button>`).join('')
  $$('[data-cat]').forEach((b) => (b.onclick = () => { f.cat = b.dataset.cat; $$('[data-cat]').forEach((x) => x.classList.toggle('active', x === b)); draw() }))
  $('#c-q').oninput = debounce((e) => { f.q = e.target.value.toLowerCase().trim(); draw() }, 200)
  $('#c-src').onchange = (e) => { f.src = e.target.value; draw() }
  $('#c-only').onchange = (e) => { f.only = e.target.value; draw() }
  $('#c-reload').onclick = async () => { try { const r = await api('POST', '/api/commands/reload'); data = await api('GET', '/api/commands'); draw(); toast(`Dimuat ulang: ${r.total} perintah aktif`) } catch (err) { toast(err.message, true) } }
  draw()
}

// ---------- Users ----------
PAGES.users = async (view) => {
  const f = { q: '', filter: '', page: 1 }
  view.innerHTML = `<div class="card">
    <div class="toolbar">
      <div class="search">${icon('search')}<input class="input" id="u-q" placeholder="Cari nomor atau nama..."></div>
      <div class="chips">${[['', 'Semua'], ['premium', 'Premium'], ['owner', 'Owner'], ['banned', 'Diblokir']].map(([k, v]) => `<button class="chip ${k === '' ? 'active' : ''}" data-uf="${k}">${v}</button>`).join('')}</div>
      <div style="flex:1"></div><button class="btn" id="u-add">${icon('plus')} Tambah premium</button>
    </div>
    <div class="table-wrap"><table><thead><tr><th>Pengguna</th><th>Status</th><th>Perintah</th><th>Terakhir aktif</th><th style="text-align:right">Aksi</th></tr></thead><tbody id="u-body"></tbody></table></div>
    <div class="row" style="justify-content:flex-end;margin-top:30px" id="u-pages"></div></div>`
  const load = async () => {
    const d = await api('GET', `/api/users?q=${encodeURIComponent(f.q)}&filter=${f.filter}&page=${f.page}`)
    $('#u-body').innerHTML = d.users.map((u) => `<tr>
      <td><div class="row">${avatarHtml(u.name || u.number)}<div><b>${esc(u.name || '-')}</b><div class="mono faint small">${u.id.endsWith('@lid') ? 'LID ' : '+'}${esc(u.number)}</div></div></div></td>
      <td><div class="row tight">${u.owner ? '<span class="badge amber">👑 Owner</span>' : ''}${u.premium ? `<span class="badge violet" title="${u.premiumTime ? 'sampai ' + esc(fmtDate(u.premiumTime)) : 'permanen'}">💎 Premium${u.premiumTime ? ' · ' + esc(new Date(u.premiumTime).toLocaleDateString('id-ID')) : ''}</span>` : ''}${u.banned ? `<span class="badge red" title="${esc(u.banReason)}">Diblokir</span>` : ''}${!u.owner && !u.premium && !u.banned ? '<span class="badge gray">Free</span>' : ''}</div></td>
      <td>${fmtNum(u.commands)}</td>
      <td class="faint small nowrap">${fmtAgo(u.lastSeen)}</td>
      <td class="nowrap" style="text-align:right">
        <button class="btn sm" data-u="${esc(u.id)}" data-a="premium" data-v="${u.premium ? 0 : 1}">${u.premium ? 'Cabut premium' : 'Premium'}</button>
        <button class="btn sm ${u.banned ? '' : 'danger'}" data-u="${esc(u.id)}" data-a="banned" data-v="${u.banned ? 0 : 1}">${u.banned ? 'Buka blokir' : 'Blokir'}</button>
        <button class="btn sm ghost" data-u="${esc(u.id)}" data-a="owner" data-v="${u.owner ? 0 : 1}" title="${u.owner ? 'Hapus owner' : 'Jadikan owner'}">👑</button>
      </td></tr>`).join('') || `<tr><td colspan="5">${empty('users', 'Belum ada pengguna', 'Pengguna tercatat otomatis saat mengirim pesan ke bot.')}</td></tr>`
    $('#u-pages').innerHTML = d.pages > 1 ? `<span class="faint small">Hal ${d.page}/${d.pages} · ${fmtNum(d.total)} pengguna</span><button class="btn sm" id="u-prev" ${d.page <= 1 ? 'disabled' : ''}>‹</button><button class="btn sm" id="u-next" ${d.page >= d.pages ? 'disabled' : ''}>›</button>` : `<span class="faint small">${fmtNum(d.total)} pengguna</span>`
    if ($('#u-prev')) { $('#u-prev').onclick = () => { f.page--; load() }; $('#u-next').onclick = () => { f.page++; load() } }
    $$('[data-u]').forEach((b) => (b.onclick = async () => {
      const a = b.dataset.a
      const v = b.dataset.v === '1'
      const body = { [a]: v }
      if (a === 'premium' && v) {
        const days = await modal({ title: 'Jadikan premium', body: 'Durasi dalam hari (0 = permanen):<br><input class="input" type="number" min="0" value="30" style="margin-top:10px">', confirm: 'Simpan' })
        if (days === false) return
        body.days = Number(days) || 0
      }
      if (a === 'banned' && v) {
        const reason = await modal({ title: 'Blokir pengguna dari bot?', body: 'Alasan (opsional):<br><input class="input" style="margin-top:10px">', confirm: 'Blokir', danger: true })
        if (reason === false) return
        body.banReason = reason === true ? '' : reason
      }
      if (a === 'owner' && v && !(await modal({ title: 'Jadikan owner?', body: 'Owner bisa memakai semua perintah, termasuk eval/exec dari pack.', confirm: 'Jadikan owner', danger: true }))) return
      try { await api('PATCH', `/api/users/${encodeURIComponent(b.dataset.u)}`, body); toast('Tersimpan'); load() } catch (err) { toast(err.message, true) }
    }))
  }
  $('#u-q').oninput = debounce((e) => { f.q = e.target.value.trim(); f.page = 1; load() }, 250)
  $$('[data-uf]').forEach((b) => (b.onclick = () => { f.filter = b.dataset.uf; f.page = 1; $$('[data-uf]').forEach((x) => x.classList.toggle('active', x === b)); load() }))
  $('#u-add').onclick = async () => {
    const num = await modal({ title: 'Tambah pengguna premium', body: 'Nomor WhatsApp (pakai kode negara):<br><input class="input" placeholder="628xxx" style="margin-top:10px">', confirm: 'Lanjut' })
    if (!num || num === true) return
    try { await api('PATCH', `/api/users/${encodeURIComponent(num.replace(/\D/g, ''))}`, { premium: true, days: 30 }); toast('Premium 30 hari ditambahkan'); load() } catch (err) { toast(err.message, true) }
  }
  await load()
}

// ---------- Bot settings ----------
PAGES.settings = async (view) => {
  const { settings: s, cardEngine } = await api('GET', '/api/settings')
  const save = async (patch) => {
    try { const r = await api('PATCH', '/api/settings', patch); Object.assign(s, r.settings); state.botName = s.botName; toast('Pengaturan disimpan') } catch (err) { toast(err.message, true) }
  }
  view.innerHTML = `
  <div class="grid grid-2">
    <div class="stack">
      <form class="card" id="f-identity"><div class="card-head"><h3>Identitas</h3></div>
        <div class="form-grid">
          <div class="field"><label>Nama bot</label><input class="input" name="botName" value="${esc(s.botName)}" required></div>
          <div class="field"><label>Nama owner</label><input class="input" name="ownerName" value="${esc(s.ownerName)}"></div>
          <div class="field full"><label>Nomor owner</label><input class="input" name="owners" value="${esc(s.owners.join(', '))}" placeholder="628xxx, 628yyy"><div class="help">Pisahkan dengan koma. Owner bisa memakai semua perintah.</div></div>
          <div class="field"><label>Pack stiker</label><input class="input" name="packname" value="${esc(s.packname)}"></div>
          <div class="field"><label>Author stiker</label><input class="input" name="author" value="${esc(s.author)}"></div>
          <div class="field full"><label>Footer</label><input class="input" name="footer" value="${esc(s.footer)}"></div>
          <div class="field"><label>Zona waktu</label><input class="input" name="timezone" value="${esc(s.timezone)}"></div>
        </div>
        <div class="row" style="margin-top:16px"><button class="btn primary">Simpan identitas</button></div>
      </form>
      <form class="card" id="f-cmd"><div class="card-head"><h3>Perintah</h3></div>
        <div class="form-grid">
          <div class="field"><label>Prefix</label><input class="input mono" name="prefixes" value="${esc(s.prefixes.join(' '))}"><div class="help">Pisahkan dengan spasi, contoh: . ! # /</div></div>
          <div class="field"><label>Mode</label><select class="select" name="mode"><option value="public">Public — semua orang</option><option value="self">Self — owner saja</option><option value="group">Grup saja</option><option value="private">Chat pribadi saja</option></select></div>
          <div class="field"><label>Jeda antar perintah (detik)</label><input class="input" type="number" min="0" max="60" name="cooldown" value="${esc(s.cooldown)}"></div>
          <div class="field"><label>Urutan prioritas sumber</label><input class="input mono" name="providerOrder" value="${esc(s.providerOrder.join(' > '))}"><div class="help">Dipakai bila nama perintah bentrok.</div></div>
        </div>
        <div class="row" style="margin-top:16px"><button class="btn primary">Simpan</button></div>
      </form>
    </div>
    <div class="stack">
      <div class="card"><div class="card-head"><h3>Perilaku</h3></div>
        ${switchRow('Tanpa prefix', 'Perintah juga jalan tanpa prefix (mis. "menu")', 'data-s="noPrefix"', s.noPrefix)}
        ${switchRow('Auto baca', 'Tandai semua pesan sudah dibaca', 'data-s="autoRead"', s.autoRead)}
        ${switchRow('Auto mengetik', 'Tampilkan "sedang mengetik..." saat memproses perintah', 'data-s="autoTyping"', s.autoTyping)}
        ${switchRow('Selalu online', 'Status online terus (notifikasi HP bisa berkurang). Berlaku setelah sambung ulang', 'data-s="alwaysOnline"', s.alwaysOnline)}
        ${switchRow('Tolak panggilan', 'Tolak otomatis telepon ke nomor bot', 'data-s="antiCall"', s.antiCall)}
        <div class="field" style="margin-top:12px"><label>Pesan saat menolak panggilan</label><input class="input" id="anticall-msg" value="${esc(s.antiCallMessage)}"></div>
      </div>
      <form class="card" id="f-welcome"><div class="card-head"><h3>Default welcome & goodbye</h3><div class="spacer"></div><span class="badge teal">${esc(cardEngine)}</span></div>
        <p class="card-sub">Dipakai di grup yang tidak punya teks sendiri. Placeholder: @user @name @group @count @desc</p>
        <div class="field"><label>Teks welcome</label><textarea class="textarea" name="welcomeText">${esc(s.welcomeText)}</textarea></div>
        <div class="field" style="margin-top:12px"><label>Teks goodbye</label><textarea class="textarea" name="goodbyeText">${esc(s.goodbyeText)}</textarea></div>
        <div class="form-grid" style="margin-top:12px">
          <div class="field"><label>Warna welcome</label><input class="input" type="color" name="welcomeColor" value="${esc(s.welcomeColor)}" style="padding:4px"></div>
          <div class="field"><label>Warna goodbye</label><input class="input" type="color" name="goodbyeColor" value="${esc(s.goodbyeColor)}" style="padding:4px"></div>
          <div class="field full"><label>Latar default (URL)</label><input class="input" name="welcomeBackground" value="${esc(s.welcomeBackground)}" placeholder="kosong = gradien bawaan"></div>
        </div>
        <img class="preview-img" id="s-preview" alt="Pratinjau kartu welcome" style="margin-top:14px">
        <div class="row" style="margin-top:14px"><button class="btn primary">Simpan</button><button type="button" class="btn" id="s-pv-w">Pratinjau welcome</button><button type="button" class="btn" id="s-pv-g">Pratinjau goodbye</button></div>
      </form>
    </div>
  </div>`
  $('[name=mode]').value = s.mode
  $$('input[data-s]').forEach((el) => (el.onchange = () => save({ [el.dataset.s]: el.checked })))
  $('#anticall-msg').onchange = (e) => save({ antiCallMessage: e.target.value })
  $('#f-identity').onsubmit = (e) => {
    e.preventDefault()
    const f = new FormData(e.target)
    save({ botName: f.get('botName'), ownerName: f.get('ownerName'), owners: String(f.get('owners')).split(/[,\s]+/).filter(Boolean), packname: f.get('packname'), author: f.get('author'), footer: f.get('footer'), timezone: f.get('timezone') })
  }
  $('#f-cmd').onsubmit = (e) => {
    e.preventDefault()
    const f = new FormData(e.target)
    save({ prefixes: String(f.get('prefixes')).split(/\s+/).filter(Boolean), mode: f.get('mode'), cooldown: Number(f.get('cooldown')), providerOrder: String(f.get('providerOrder')).split(/[>\s,]+/).filter(Boolean) })
  }
  const pv = async (kind) => {
    const f = new FormData($('#f-welcome'))
    try {
      const blob = await api('POST', `/api/preview/${kind}`, { background: f.get('welcomeBackground'), color: f.get(kind === 'welcome' ? 'welcomeColor' : 'goodbyeColor'), groupName: s.botName + ' Community' })
      $('#s-preview').src = URL.createObjectURL(blob)
    } catch (err) { toast(err.message, true) }
  }
  $('#s-pv-w').onclick = () => pv('welcome')
  $('#s-pv-g').onclick = () => pv('goodbye')
  $('#f-welcome').onsubmit = (e) => {
    e.preventDefault()
    const f = new FormData(e.target)
    save(Object.fromEntries(['welcomeText', 'goodbyeText', 'welcomeColor', 'goodbyeColor', 'welcomeBackground'].map((k) => [k, f.get(k)])))
    pv('welcome')
  }
  pv('welcome')
}

// ---------- System ----------
PAGES.system = async (view) => {
  const c = await api('GET', '/api/config')
  const o = await api('GET', '/api/overview')
  const dbForm = (driver) => {
    if (driver === 'json') return `<div class="field"><label>File</label><input class="input mono" name="file" value="${esc(c.database.json.file)}"></div>`
    if (driver === 'sqlite') return `<div class="field"><label>File</label><input class="input mono" name="file" value="${esc(c.database.sqlite.file)}"></div><p class="faint small">Memakai modul bawaan Node.js (node:sqlite), tanpa instalasi tambahan.</p>`
    const m = c.database.mysql
    return `<div class="form-grid"><div class="field"><label>Host</label><input class="input" name="host" value="${esc(m.host)}"></div><div class="field"><label>Port</label><input class="input" name="port" type="number" value="${esc(m.port)}"></div><div class="field"><label>User</label><input class="input" name="user" value="${esc(m.user)}"></div><div class="field"><label>Password</label><input class="input" name="password" type="password" value="${esc(m.password)}" placeholder="kosong untuk XAMPP default"></div><div class="field full"><label>Nama database</label><input class="input" name="database" value="${esc(m.database)}"><div class="help">Dibuat otomatis bila belum ada. XAMPP: jalankan <b>MySQL</b> di XAMPP Control Panel dulu.</div></div></div>`
  }
  view.innerHTML = `
  ${c.database.driver !== c.database.active ? `<div class="alert warn">${icon('alert')}<div>Config memakai <b>${esc(c.database.driver)}</b>, tapi yang aktif <b>${esc(c.database.active)}</b>. Restart bot untuk menerapkan.</div></div>` : ''}
  <div class="grid grid-2">
    <div class="stack">
      <form class="card" id="db-form"><div class="card-head"><h3>Database</h3><div class="spacer"></div><span class="badge green">aktif: ${esc(c.database.active)}</span></div>
        <p class="card-sub">Pilih tempat menyimpan data bot. "Pindahkan data" menyalin semua data ke penyimpanan baru lalu memakainya setelah restart.</p>
        <div class="chips" style="margin-bottom:16px">${c.drivers.map((d) => `<button type="button" class="chip ${d === c.database.driver ? 'active' : ''}" data-drv="${d}">${{ json: 'JSON file', sqlite: 'SQLite', mysql: 'MySQL / XAMPP' }[d]}</button>`).join('')}</div>
        <div id="db-fields"></div>
        <div class="row" style="margin-top:16px"><button type="button" class="btn" id="db-test">${icon('db')} Tes koneksi</button><button class="btn primary">Pindahkan data & pakai</button></div>
        <div class="faint small" style="margin-top:12px">${Object.entries(o.database.collections).map(([k, v]) => `${esc(k)}: ${fmtNum(v)}`).join(' · ')}</div>
      </form>
      <form class="card" id="dash-form"><div class="card-head"><h3>Dashboard</h3></div>
        <div class="form-grid">
          <div class="field"><label>Host</label><input class="input mono" name="host" value="${esc(c.dashboard.host)}"><div class="help">127.0.0.1 = hanya komputer ini. 0.0.0.0 = bisa dari jaringan.</div></div>
          <div class="field"><label>Port</label><input class="input" type="number" name="port" value="${esc(c.dashboard.port)}"></div>
          <div class="field full"><label>Password baru</label><input class="input" type="password" name="password" placeholder="kosongkan bila tidak diganti" autocomplete="new-password"></div>
        </div>
        <div class="row" style="margin-top:16px"><button class="btn primary">Simpan</button><span class="faint small">Berlaku setelah restart.</span></div>
      </form>
    </div>
    <div class="stack">
      <div class="card"><div class="card-head"><h3>Kontrol</h3></div>
        <div class="row"><button class="btn" id="sys-reconnect">${icon('refresh')} Sambung ulang WhatsApp</button><button class="btn primary" id="sys-restart">${icon('power')} Restart bot</button></div>
        ${c.launcher ? '' : '<p class="faint small">Bot tidak dijalankan lewat <code>npm start</code>, jadi tombol restart hanya menghentikan bot.</p>'}
      </div>
      <form class="card" id="login-form"><div class="card-head"><h3>Login WhatsApp</h3></div>
        <div class="form-grid"><div class="field"><label>Metode login</label><select class="select" name="loginMethod"><option value="pairing">Kode pairing</option><option value="qr">QR code</option></select></div>
        <div class="field"><label>Nomor bot (pairing otomatis)</label><input class="input" name="pairingNumber" value="${esc(c.bot.pairingNumber)}" placeholder="628xxx"></div></div>
        <div class="row" style="margin-top:16px"><button class="btn primary">Simpan</button><span class="faint small">Sesi tersimpan di <code>${esc(c.bot.sessionDir)}</code></span></div>
      </form>
      <form class="card" id="pack-form"><div class="card-head"><h3>Pack fitur</h3></div>
        ${switchRow('vanXone', '±2.250 perintah (7 engine). Butuh restart.', 'name="vanxone"', c.packs.vanxone)}
        ${switchRow('Rubby-MD', '±270 perintah. Butuh restart.', 'name="rubby"', c.packs.rubby)}
        <div class="row" style="margin-top:12px"><button class="btn primary">Simpan</button></div>
      </form>
      <form class="card" id="key-form"><div class="card-head"><h3>API key</h3></div><p class="card-sub">Dipakai fitur pack (downloader, maker, AI, dll). Nilai tersimpan disamarkan.</p>
        <div class="form-grid">${Object.entries(c.apiKeys).map(([k, v]) => `<div class="field"><label>${esc(k)}</label><input class="input mono" name="${esc(k)}" value="${esc(v)}" placeholder="-"></div>`).join('')}</div>
        <div class="row" style="margin-top:16px"><button class="btn primary">Simpan</button></div>
      </form>
    </div>
  </div>`
  let driver = c.database.driver
  const drawDb = () => { $('#db-fields').innerHTML = dbForm(driver) }
  drawDb()
  $$('[data-drv]').forEach((b) => (b.onclick = () => { driver = b.dataset.drv; $$('[data-drv]').forEach((x) => x.classList.toggle('active', x === b)); drawDb() }))
  const dbOpts = () => { const f = new FormData($('#db-form')); const o = Object.fromEntries(f.entries()); if (o.port) o.port = Number(o.port); return o }
  $('#db-test').onclick = async () => { try { const r = await api('POST', '/api/database/test', { driver, options: dbOpts() }); toast(`Koneksi ${driver} OK (${r.rows} baris)`) } catch (err) { toast(err.message, true) } }
  $('#db-form').onsubmit = async (e) => {
    e.preventDefault()
    if (!(await modal({ title: `Pindahkan data ke ${driver}?`, body: 'Semua data saat ini akan disalin ke penyimpanan baru (data lama tidak dihapus). Setelah itu bot perlu restart.', confirm: 'Pindahkan' }))) return
    try {
      const r = await api('POST', '/api/database/migrate', { driver, options: dbOpts() })
      toast(`${fmtNum(r.rows)} baris disalin ke ${driver}`)
      if (await modal({ title: 'Restart sekarang?', body: 'Database baru dipakai setelah bot restart.', confirm: 'Restart' })) await api('POST', '/api/system/restart')
    } catch (err) { toast(err.message, true) }
  }
  $('#dash-form').onsubmit = async (e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); if (!f.password) delete f.password; try { await api('PATCH', '/api/config', { dashboard: f }); toast('Disimpan, restart untuk menerapkan') } catch (err) { toast(err.message, true) } }
  $('[name=loginMethod]').value = c.bot.loginMethod
  $('#login-form').onsubmit = async (e) => { e.preventDefault(); try { await api('PATCH', '/api/config', { bot: Object.fromEntries(new FormData(e.target)) }); toast('Disimpan, berlaku setelah restart') } catch (err) { toast(err.message, true) } }
  $('#pack-form').onsubmit = async (e) => { e.preventDefault(); try { await api('PATCH', '/api/config', { packs: { vanxone: $('[name=vanxone]').checked, rubby: $('[name=rubby]').checked } }); toast('Disimpan, restart untuk menerapkan') } catch (err) { toast(err.message, true) } }
  $('#key-form').onsubmit = async (e) => { e.preventDefault(); try { await api('PATCH', '/api/config', { apiKeys: Object.fromEntries(new FormData(e.target)) }); toast('API key disimpan, restart untuk menerapkan') } catch (err) { toast(err.message, true) } }
  $('#sys-reconnect').onclick = async () => { try { await api('POST', '/api/connection/reconnect'); toast('Menyambung ulang...') } catch (err) { toast(err.message, true) } }
  $('#sys-restart').onclick = async () => {
    if (!(await modal({ title: 'Restart bot?', body: 'Bot akan mati sebentar lalu menyala lagi.', confirm: 'Restart' }))) return
    await api('POST', '/api/system/restart')
    toast('Restart... halaman dimuat ulang dalam 8 detik')
    setTimeout(() => location.reload(), 8000)
  }
}

// ---------- Logs ----------
PAGES.logs = async (view) => {
  const initial = await api('GET', '/api/logs?limit=500')
  let paused = false
  let level = ''
  let q = ''
  view.innerHTML = `
    <div class="toolbar">
      <div class="search">${icon('search')}<input class="input" id="l-q" placeholder="Filter teks..."></div>
      <div class="chips">${['', 'info', 'success', 'warn', 'error', 'cmd'].map((l) => `<button class="chip ${l === '' ? 'active' : ''}" data-lv="${l}">${l || 'Semua'}</button>`).join('')}</div>
      <div style="flex:1"></div>
      <button class="btn" id="l-pause">Jeda</button><button class="btn" id="l-clear">Bersihkan</button>
    </div>
    <div class="logs" id="logs"></div>`
  const box = $('#logs')
  const line = (e) => `<div class="log-line"><span class="t">${new Date(e.time).toLocaleTimeString('id-ID', { hour12: false })}</span><span class="lv lv-${e.level}">${e.level.toUpperCase()}</span><span class="s">[${esc(e.scope)}]</span><span>${esc(e.message)}</span></div>`
  const match = (e) => (!level || e.level === level) && (!q || e.message.toLowerCase().includes(q) || e.scope.includes(q))
  const all = [...initial]
  const redraw = () => { box.innerHTML = all.filter(match).slice(-800).map(line).join(''); box.scrollTop = box.scrollHeight }
  redraw()
  const onLog = (e) => {
    all.push(e)
    if (all.length > 2000) all.splice(0, 500)
    if (paused || !match(e)) return
    const stick = box.scrollHeight - box.scrollTop - box.clientHeight < 60
    box.insertAdjacentHTML('beforeend', line(e))
    while (box.children.length > 800) box.firstChild.remove()
    if (stick) box.scrollTop = box.scrollHeight
  }
  state.logListeners.add(onLog)
  onLeave(() => state.logListeners.delete(onLog))
  $$('[data-lv]').forEach((b) => (b.onclick = () => { level = b.dataset.lv; $$('[data-lv]').forEach((x) => x.classList.toggle('active', x === b)); redraw() }))
  $('#l-q').oninput = debounce((e) => { q = e.target.value.toLowerCase(); redraw() }, 200)
  $('#l-pause').onclick = (e) => { paused = !paused; e.target.textContent = paused ? 'Lanjut' : 'Jeda'; if (!paused) redraw() }
  $('#l-clear').onclick = () => { all.length = 0; box.innerHTML = '' }
}

// ================= boot =================
async function boot() {
  try {
    const s = await api('GET', '/api/session')
    state.botName = s.botName || state.botName
    document.title = `${state.botName} — Dashboard`
    if (!s.authenticated) return renderLogin()
  } catch {
    $('#app').innerHTML = '<div class="login"><div class="card"><h2>Dashboard tidak bisa dihubungi</h2><p class="muted">Pastikan bot sedang berjalan, lalu muat ulang halaman ini.</p></div></div>'
    return
  }
  $('#app').innerHTML = ''
  renderLayout()
  startEvents()
  api('GET', '/api/overview').then((o) => { state.status = o.status; updateMe(o.status); $('#nav-groups').textContent = o.counts.groups; $('#conn-pill').innerHTML = connPill(o.status) }).catch(() => {})
  render()
}

window.addEventListener('hashchange', () => { if ($('.layout')) render() })
boot()
