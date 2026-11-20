// Cegah dua proses bot memakai folder session yang sama (penyebab utama error "Bad MAC").
const fs = require('fs')

function isBotProcess(pid) {
  try {
    const cmd = fs.readFileSync(`/proc/${pid}/cmdline`, 'utf8')
    return /node|bun|bot\.js/i.test(cmd) // PID dipakai proses lain = kunci basi
  } catch {
    return true // tidak bisa memeriksa -> anggap masih hidup (lebih aman)
  }
}

function alive(pid) {
  try {
    process.kill(pid, 0)
    return isBotProcess(pid)
  } catch (e) {
    return e.code === 'EPERM'
  }
}

// { ok: true } jika berhasil mengunci; { ok: false, pid } jika ada instance lain yang masih hidup
function acquire(file) {
  let other = 0
  try {
    other = Number(fs.readFileSync(file, 'utf8'))
  } catch {}
  if (other && other !== process.pid && alive(other)) return { ok: false, pid: other }

  fs.writeFileSync(file, String(process.pid))
  const release = () => {
    try {
      if (Number(fs.readFileSync(file, 'utf8')) === process.pid) fs.unlinkSync(file)
    } catch {}
  }
  process.on('exit', release)
  for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => process.exit(0))
  return { ok: true, release }
}

module.exports = { acquire, alive }
