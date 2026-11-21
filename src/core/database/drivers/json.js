import fs from 'node:fs'
import path from 'node:path'

/** Simpan semua data di satu file JSON. Paling mudah, cocok untuk bot kecil. */
export class JsonDriver {
  constructor(options = {}, root = process.cwd()) {
    this.name = 'json'
    this.file = path.resolve(root, options.file || 'data/database.json')
  }

  describe() {
    return { file: this.file }
  }

  async connect() {
    fs.mkdirSync(path.dirname(this.file), { recursive: true })
  }

  async load() {
    if (!fs.existsSync(this.file)) return []
    const raw = fs.readFileSync(this.file, 'utf8').trim()
    if (!raw) return []
    const json = JSON.parse(raw)
    const rows = []
    for (const [collection, docs] of Object.entries(json)) {
      for (const [id, value] of Object.entries(docs || {})) rows.push({ collection, id, data: JSON.stringify(value) })
    }
    return rows
  }

  async save({ data }) {
    const tmp = `${this.file}.tmp`
    await fs.promises.writeFile(tmp, JSON.stringify(data, null, 1))
    await fs.promises.rename(tmp, this.file)
  }

  async close() {}
}
