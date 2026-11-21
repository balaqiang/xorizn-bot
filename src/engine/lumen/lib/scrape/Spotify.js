/**
 * Judul : Play Lagu dari Spotify
 * Base Url : spotidown.app
 * Author : t.me/Velzyguy
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import crypto from 'crypto'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

async function searchSpotiDown(query) {
  if (!query) {
    throw new Error('Query Spotify kosong')
  }

  try {
    // =========================================================
    // GET HOMEPAGE
    // =========================================================

    const resHome = await axios.get('https://spotidown.app/en6', {
      headers: {
        'User-Agent': USER_AGENT
      },
      timeout: 30000
    })

    // =========================================================
    // COOKIE
    // =========================================================

    const cookies = resHome.headers['set-cookie'] || []

    const cookieHeader = cookies
      .map(cookie => cookie.split(';')[0])
      .join('; ')

    // =========================================================
    // PARSE HIDDEN INPUT
    // =========================================================

    const $1 = cheerio.load(resHome.data)

    const hiddenInputs = {}

    $1('form[name="spotifyurl"] input[type="hidden"]').each((_, el) => {
      const name = $1(el).attr('name')
      const value = $1(el).attr('value') || ''

      if (name) {
        hiddenInputs[name] = value
      }
    })

    // =========================================================
    // ACTION REQUEST
    // =========================================================

    const paramsAction = new URLSearchParams()

    paramsAction.append('url', query)

    for (const [key, value] of Object.entries(hiddenInputs)) {
      paramsAction.append(key, value)
    }

    const resAction = await axios.post(
      'https://spotidown.app/action',
      paramsAction.toString(),
      {
        headers: {
          'User-Agent': USER_AGENT,
          'Content-Type':
            'application/x-www-form-urlencoded; charset=UTF-8',
          Cookie: cookieHeader,
          Referer: 'https://spotidown.app/en6',
          Origin: 'https://spotidown.app',
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 30000
      }
    )

    // =========================================================
    // PARSE RESPONSE
    // =========================================================

    let responseData = resAction.data

    if (typeof responseData === 'string') {
      try {
        responseData = JSON.parse(responseData)
      } catch {
        throw new Error('Response Spotidown tidak valid')
      }
    }

    if (responseData.error) {
      throw new Error(
        responseData.message || 'Gagal mencari lagu'
      )
    }

    if (!responseData.data) {
      throw new Error('Data lagu tidak ditemukan')
    }

    // =========================================================
    // PARSE TRACK FORM
    // =========================================================

    const $2 = cheerio.load(responseData.data)

    const firstForm = $2('form[name="submitspurl"]').first()

    if (!firstForm.length) {
      throw new Error('Lagu tidak ditemukan')
    }

    const rawData = firstForm
      .find('input[name="data"]')
      .val()

    const baseVal = firstForm
      .find('input[name="base"]')
      .val()

    const tokenVal = firstForm
      .find('input[name="token"]')
      .val()

    if (!rawData || !baseVal || !tokenVal) {
      throw new Error(
        'Data token download Spotify tidak ditemukan'
      )
    }

    // =========================================================
    // DECODE METADATA
    // =========================================================

    let trackMeta = {}

    try {
      const decoded = Buffer
        .from(rawData, 'base64')
        .toString('utf-8')

      trackMeta = JSON.parse(decoded)
    } catch {
      // metadata gagal decode, lanjutkan download
    }

    // =========================================================
    // TRACK DOWNLOAD REQUEST
    // =========================================================

    const paramsTrack = new URLSearchParams()

    paramsTrack.append('data', rawData)
    paramsTrack.append('base', baseVal)
    paramsTrack.append('token', tokenVal)

    const resTrack = await axios.post(
      'https://spotidown.app/action/track',
      paramsTrack.toString(),
      {
        headers: {
          'User-Agent': USER_AGENT,
          'Content-Type':
            'application/x-www-form-urlencoded; charset=UTF-8',
          Cookie: cookieHeader,
          Referer: 'https://spotidown.app/en6',
          Origin: 'https://spotidown.app',
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 30000
      }
    )

    // =========================================================
    // PARSE DOWNLOAD RESPONSE
    // =========================================================

    let trackRespData = resTrack.data

    if (typeof trackRespData === 'string') {
      try {
        trackRespData = JSON.parse(trackRespData)
      } catch {
        throw new Error(
          'Response download Spotidown tidak valid'
        )
      }
    }

    if (trackRespData.error) {
      throw new Error(
        trackRespData.message ||
        'Gagal mendapatkan link download'
      )
    }

    let downloadUrl = null

    if (trackRespData.data) {
      const $dl = cheerio.load(trackRespData.data)

      downloadUrl =
        $dl('a.abutton[href]').attr('href') ||
        $dl('a[href*="download"]').attr('href') ||
        null
    }

    if (!downloadUrl) {
      throw new Error(
        'URL download Spotify tidak ditemukan'
      )
    }

    // =========================================================
    // RESULT
    // =========================================================

    return {
      status: true,
      title: trackMeta.name || null,
      artist: trackMeta.artist || null,
      album: trackMeta.album || null,
      duration: trackMeta.duration || null,
      image: trackMeta.cover || null,
      download_url: downloadUrl
    }

  } catch (error) {
    throw new Error(
      `Spotidown Error: ${error?.message || 'Unknown error'}`
    )
  }
}

class Spotify {
  constructor() {
    this.secret = '376136387538459893883312310911992847112448894410210511297108'
    this.version = 61
    this.client_version = '1.2.88.61.ge172202b'

    this.api = axios.create({
      timeout: 30000,
      headers: {
        referer: 'https://open.spotify.com/',
        origin: 'https://open.spotify.com',
        accept: 'application/json',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0'
      }
    })
  }

  generateTOTP(tsms = Date.now()) {
    const counter = Math.floor((tsms / 1000) / 30)
    const buffer = Buffer.alloc(8)
    buffer.writeBigInt64BE(BigInt(counter))

    const digest = crypto
      .createHmac('sha1', Buffer.from(this.secret, 'utf8'))
      .update(buffer)
      .digest()

    const offset = digest[digest.length - 1] & 0xf
    const code = (digest.readUInt32BE(offset) & 0x7fffffff) % 1000000

    return String(code).padStart(6, '0')
  }

  async getToken() {
    if (this.api.defaults.headers.authorization) return true

    const sts = Math.floor(Date.now() / 1000)

    const { data: token } = await this.api.get('https://open.spotify.com/api/token', {
      params: {
        reason: 'init',
        productType: 'web-player',
        totp: this.generateTOTP(Date.now()),
        totpServer: this.generateTOTP(sts * 1000),
        totpVer: String(this.version)
      }
    })

    const { data: client } = await this.api.post('https://clienttoken.spotify.com/v1/clienttoken', {
      client_data: {
        client_version: this.client_version,
        client_id: token.clientId,
        js_sdk_data: {
          device_brand: 'unknown',
          device_model: 'unknown',
          os: 'linux',
          os_version: '24.04',
          device_id: crypto.randomUUID(),
          device_type: 'computer'
        }
      }
    })

    Object.assign(this.api.defaults.headers, {
      'accept-language': 'en',
      'app-platform': 'WebPlayer',
      authorization: `Bearer ${token.accessToken}`,
      'client-token': client.granted_token.token,
      'spotify-app-version': this.client_version
    })

    return true
  }

  async query(operationName, sha256Hash, variables) {
    await this.getToken()

    const { data } = await this.api.post('https://api-partner.spotify.com/pathfinder/v2/query', {
      variables,
      operationName,
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash
        }
      }
    })

    return data
  }

  async search(q) {
    const data = await this.query(
      'searchDesktop',
      '21b3fe49546912ba782db5c47e9ef5a7dbd20329520ba0c7d0fcfadee671d24e',
      {
        searchTerm: q,
        offset: 0,
        limit: 10,
        numberOfTopResults: 5,
        includeAudiobooks: true,
        includeArtistHasConcertsField: false,
        includePreReleases: true,
        includeAuthors: false,
        includeEpisodeContentRatingsV2: false
      }
    )

    return data?.data?.searchV2
  }

  async track(id) {
    const data = await this.query(
      'getTrack',
      '612585ae06ba435ad26369870deaae23b5c8800a256cd8a57e08eddc25a37294',
      { uri: `spotify:track:${id}` }
    )

    return data?.data?.trackUnion
  }
}

const spotify = new Spotify()

function spotifyUrl(text = '') {
  const match = String(text).match(/open\.spotify\.com\/(track)\/([a-zA-Z0-9]+)/i)
  if (!match) return null
  return {
    type: match[1],
    id: match[2]
  }
}

function msToTime(ms = 0) {
  const sec = Math.floor(ms / 1000)
  const min = Math.floor(sec / 60)
  const s = sec % 60
  return `${min}:${String(s).padStart(2, '0')}`
}

function getImages(o) {
  return o?.sources || []
}

function getBestImage(images = []) {
  return images?.[0]?.url || images?.[images.length - 1]?.url || null
}

function parseTrack(t) {
  if (!t) return null

  return {
    id: t.uri?.split(':')?.[2],
    url: t.uri ? `https://open.spotify.com/track/${t.uri.split(':')[2]}` : null,
    title: t.name || '-',
    duration: t.duration?.totalMilliseconds || 0,
    playcount: Number(t.playcount || 0),
    explicit: t.contentRating?.label === 'EXPLICIT',
    artists: [
      ...(t.firstArtist?.items || []),
      ...(t.otherArtists?.items || []),
      ...(t.artists?.items || [])
    ].map(v => v.profile?.name).filter(Boolean),
    album: {
      name: t.albumOfTrack?.name || '-',
      year: t.albumOfTrack?.date?.year || '-',
      image: getBestImage(getImages(t.albumOfTrack?.coverArt))
    }
  }
}

function parseSearch(data) {
  const tracks =
    data?.tracksV2?.items ||
    data?.topResultsV2?.itemsV2?.filter(v => v.item?.__typename === 'TrackResponseWrapper') ||
    []

  return tracks.map(node => {
    const t = node.item?.data || node.data
    if (!t) return null

    return {
      id: t.uri?.split(':')?.[2],
      url: t.uri ? `https://open.spotify.com/track/${t.uri.split(':')[2]}` : null,
      title: t.name || '-',
      duration: t.duration?.totalMilliseconds || 0,
      explicit: t.contentRating?.label === 'EXPLICIT',
      artists: (t.artists?.items || []).map(v => v.profile?.name).filter(Boolean),
      album: {
        name: t.albumOfTrack?.name || '-',
        image: getBestImage(getImages(t.albumOfTrack?.coverArt))
      }
    }
  }).filter(Boolean)
}

function formatTrack(t) {
  return `🎧 *SPOTIFY TRACK*

*Judul:* ${t.title}
*Artist:* ${t.artists.join(', ') || '-'}
*Album:* ${t.album.name}
*Rilis:* ${t.album.year}
*Durasi:* ${msToTime(t.duration)}
*Playcount:* ${t.playcount.toLocaleString('id-ID')}
*Explicit:* ${t.explicit ? 'Ya' : 'Tidak'}

${t.url}`
}

function formatSearch(list, query) {
  return `🎧 *SPOTIFY SEARCH*

Query: *${query}*

${list.slice(0, 10).map((v, i) => {
  return `${i + 1}. *${v.title}*
   👤 ${v.artists.join(', ') || '-'}
   💿 ${v.album.name}
   ⏱️ ${msToTime(v.duration)}
   🔗 ${v.url}`
}).join('\n\n')}`
}

// =============================================================
// EXPORT ESM
// =============================================================

export {
  searchSpotiDown,
  Spotify,
  spotify,
  spotifyUrl,
  parseTrack,
  parseSearch,
  formatTrack,
  formatSearch
}

export default {
  searchSpotiDown,
  Spotify,
  spotify
}