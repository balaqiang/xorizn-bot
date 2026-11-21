// lib/savetube.js — audio YouTube lewat Savetube (mesin dari xorizn-bot). Dipakai .playch
'use strict'
const axios = require('axios')
const crypto = require('crypto')

const KEY = Buffer.from('C5D58EF67A7584E4A29F6C35BBC4EB12', 'hex')
const ID_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/
const http = axios.create({
  timeout: 30000,
  headers: { 'content-type': 'application/json', origin: 'https://yt.savetube.me', 'user-agent': 'Mozilla/5.0 (Android 15; Mobile; SM-F958; rv:130.0) Gecko/130.0 Firefox/130.0' }
})

function decrypt(b64) {
  const raw = Buffer.from(b64, 'base64')
  const d = crypto.createDecipheriv('aes-128-cbc', KEY, raw.subarray(0, 16))
  return JSON.parse(Buffer.concat([d.update(raw.subarray(16)), d.final()]).toString('utf8'))
}

async function audio(url, quality = '128') {
  const id = String(url).match(ID_RE)?.[1]
  if (!id) throw new Error('ID video YouTube tidak terbaca')
  const { data: cdn } = await http.get('https://media.savetube.vip/api/random-cdn')
  if (!cdn?.cdn) throw new Error('server Savetube tidak tersedia')
  const info = decrypt((await http.post(`https://${cdn.cdn}/v2/info`, { url: `https://www.youtube.com/watch?v=${id}` })).data.data)
  const dl = await http.post(`https://${cdn.cdn}/download`, { id, downloadType: 'audio', quality, key: info.key })
  const link = dl.data?.data?.downloadUrl
  if (!link) throw new Error('link audio tidak ditemukan')
  return { title: info.title, url: link }
}

module.exports = { audio }
