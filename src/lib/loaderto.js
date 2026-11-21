// lib/loaderto.js — YouTube mp3/mp4 lewat savenow (mesin dari xorizn-bot). Dipakai .ytmp3 / .ytmp4, dengan cadangan mesin lama.
'use strict'
const axios = require('axios')

const BASE = 'https://p.savenow.to'
const HEAD = { accept: '*/*', Referer: 'https://en.loader.to/', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36' }
const key = () => global.downloader?.loaderKey || 'dfcb6d76f2f6a9894gjkege8a4ab232222'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// format: 'mp3' | '360' | '480' | '720' | '1080'
async function get(url, format = 'mp3') {
  const q = new URLSearchParams({ format, url, apikey: key(), add_info: '1' })
  const { data: first } = await axios.get(`${BASE}/api/v2/download?${q}`, { headers: HEAD, timeout: 30000 })
  if (!first?.success) throw new Error(first?.error || 'permintaan ditolak server')
  let res = first
  for (let i = 0; i < 50 && !(res.download_url || res.url); i++) {
    await sleep(1500)
    const { data } = await axios.get(`${BASE}/api/progress`, { params: { id: first.id, _: Date.now() }, headers: HEAD, timeout: 20000 })
    res = data
    if (res.error || /fail|error|gagal/i.test(res.text || '')) throw new Error(res.text || res.error || 'proses gagal')
  }
  const link = res.download_url || res.url
  if (!link) throw new Error('timeout menunggu hasil')
  return { url: link, title: first.info?.title || 'YouTube', thumb: first.info?.image || '' }
}

module.exports = { get }
