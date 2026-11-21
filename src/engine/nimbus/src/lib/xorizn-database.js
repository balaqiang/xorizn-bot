// getDatabase() -> basis data Xorizn asli (users/groups/settings/stats/sewa/premium/owner, koin/energi/exp/level, cooldown, dst).
// Kode asli ada di xorizn-database-core.js (hanya lowdb diganti xorizn-minilow.js). Data disimpan di database/xorizn/*.json.
// Kompatibel dengan plugin lama: db.db.data.characterai tetap tersedia (disimpan di database/xorizn.json).
import path from 'path'
import { createRequire } from 'module'
import { Database } from './xorizn-database-core.js'
const require = createRequire(import.meta.url)

const inst = new Database(path.resolve(process.cwd(), 'database', 'xorizn'))
await inst.init()
try {
  const legacy = require('../../../../lib/jstore').open('xorizn', { users: {}, groups: {}, characterai: {} })
  if (!Object.getOwnPropertyDescriptor(inst.db.data, 'characterai')) {
    Object.defineProperty(inst.db.data, 'characterai', { enumerable: false, configurable: true, get: () => legacy.data.characterai || (legacy.data.characterai = {}) })
  }
  const origSave = inst.save.bind(inst)
  inst.save = async () => { legacy.save(); return origSave() }
} catch {}

export function getDatabase() { return inst }
export async function initDatabase() { return inst }
export { Database }
export default getDatabase
