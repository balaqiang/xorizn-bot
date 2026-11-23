import http from 'node:http'
import { once } from 'node:events'
import { randomUUID } from 'node:crypto'
import sharp from 'sharp'

export async function startImageFixture() {
  const apiKey = 'fixture/' + randomUUID()
  const images = await Promise.all(['red', 'blue'].map(background =>
    sharp({ create: { width: 2, height: 2, channels: 3, background } }).png().toBuffer()
  ))
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, baseUrl)
    const image = /^\/image\/([01])\.png$/.exec(url.pathname)
    if (image && url.searchParams.get('key') === apiKey) {
      res.writeHead(200, { 'content-type': 'image/png' })
      return res.end(images[Number(image[1])])
    }
    if (req.headers.authorization !== 'Bearer ' + apiKey) {
      res.writeHead(401)
      return res.end()
    }
    const urls = images.map((_, i) => baseUrl + '/image/' + i + '.png?key=' + encodeURIComponent(apiKey))
    const echo = { authorization: req.headers.authorization, nested: { apiKey }, mirror: apiKey, padded: 'x'.repeat(75) + apiKey, encoded: Buffer.from(apiKey).toString('base64') }
    const responses = {
      '/first': { result: { images: urls }, echo },
      '/second': { data: { items: urls.map(url => ({ url })) }, echo },
      '/literal': { result: { images: { random: urls } }, echo },
      '/object': { result: { images: { a: urls[0], b: urls[1] } } },
      '/empty': { result: { images: [] }, echo },
      '/large': { result: { images: Array(60).fill(urls[0]) }, echo }
    }
    res.writeHead(responses[url.pathname] ? 200 : 404, { 'content-type': 'application/json' })
    res.end(JSON.stringify(responses[url.pathname] ?? {}))
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const baseUrl = 'http://127.0.0.1:' + server.address().port
  return { baseUrl, apiKey, images, close: () => new Promise(resolve => {
    server.close(resolve)
    server.closeAllConnections()
  }) }
}
