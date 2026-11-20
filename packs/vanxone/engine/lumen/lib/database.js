import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';

/* ============================================================
 * vanXone — SQL.JS DATABASE
 *
 * Features:
 * - Automatic recovery from database.sqlite.bak
 * - SQLite integrity checking
 * - JSON record validation
 * - Atomic file replacement
 * - Serialized writes
 * - Legacy database.json migration
 * - User/chat/settings compatibility
 * - Persistent lastReset
 * ============================================================ */

const TABLES = [
  'users',
  'chats',
  'settings',
  'stats',
  'msgs',
  'sticker',
  'blacklistUser'
];

const ALL_TABLES = [...TABLES, 'owners', 'meta'];

export const defaultUser = {
  name: '',
  exp: 0,
  money: 0,
  level: 1,
  limit: 20,
  age: -1,
  regTime: -1,
  afk: -1,
  afkReason: '',
  warn: 0,
  role: 'Newbie',
  premium: false,
  premiumTime: 0,
  registered: false,
  banned: false,
  autolevelup: false,
  bibitapel: 0,
  bibitjeruk: 0,
  bibitdurian: 0,
  bibitmangga: 0,
  bibitpisang: 0,
  apel: 0,
  jeruk: 0,
  durian: 0,
  mangga: 0,
  pisang: 0,
  banteng: 0,
  harimau: 0,
  gajah: 0,
  kambing: 0,
  panda: 0,
  buaya: 0,
  kerbau: 0,
  sapi: 0,
  monyet: 0,
  babihutan: 0,
  babi: 0,
  ayam: 0,
  ikan: 0,
  lele: 0,
  nila: 0,
  bawal: 0,
  udang: 0,
  paus: 0,
  kepiting: 0,
  sword: 0,
  pickaxe: 0,
  axe: 0,
  fishingrod: 0,
  armor: 0,
  atm: 0,
  sworddurability: 0,
  pickaxedurability: 0,
  axedurability: 0,
  fishingroddurability: 0,
  armordurability: 0,
  fullatm: 0,
  potion: 0,
  string: 0,
  wood: 0,
  rock: 0,
  coal: 0,
  iron: 0,
  diamond: 0,
  emerald: 0,
  trash: 0,
  common: 0,
  uncommon: 0,
  mythic: 0,
  legendary: 0,
  ayambakar: 0,
  ayamgoreng: 0,
  oporayam: 0,
  gulaiayam: 0,
  steak: 0,
  rendang: 0,
  babipanggang: 0,
  ikanbakar: 0,
  lelebakar: 0,
  nilabakar: 0,
  bawalbakar: 0,
  udangbakar: 0,
  pausbakar: 0,
  kepitingbakar: 0,
  lastadventure: 0,
  lastbansos: 0,
  lastberburu: 0,
  lastdagang: 0,
  lastduel: 0,
  lastrampok: 0,
  lastmining: 0,
  lastnebang: 0,
  lastnguli: 0,
  lastclaim: 0,
  lastweekly: 0,
  lastmonthly: 0,
  lastenergy: 0,
  health: 100,
  maxhealth: 100,
  stamina: 100,
  mana: 50,
  energy: 100,
  gold: 0,
  bank: 0,
  horse: 0,
  horseexp: 0,
  bait: 0,
  fertilizer: 0
};

export const defaultChat = {
  sWelcome: '',
  sBye: '',
  sPromote: '',
  sDemote: '',
  isBanned: false,
  welcome: false,
  detect: false,
  delete: false
};

export const defaultSettings = {
  public: true,
  autoread: true,
  anticall: true
};

function createEmptyData() {
  return {
    users: {},
    chats: {},
    settings: {},
    stats: {},
    msgs: {},
    sticker: {},
    owners: [],
    blacklistUser: {},
    lastReset: null
  };
}

function parseJSON(value, description) {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`JSON tidak valid pada ${description}: ${error.message}`);
  }
}

function getRowCount(data) {
  let count = 0;
  for (const table of TABLES) {
    count += Object.keys(data[table] || {}).length;
  }
  count += (data.owners || []).length;
  return count;
}

function getSchemas() {
  return `
    CREATE TABLE IF NOT EXISTS users ( id TEXT PRIMARY KEY, data TEXT NOT NULL ); 
    CREATE TABLE IF NOT EXISTS chats ( id TEXT PRIMARY KEY, data TEXT NOT NULL ); 
    CREATE TABLE IF NOT EXISTS settings ( id TEXT PRIMARY KEY, data TEXT NOT NULL ); 
    CREATE TABLE IF NOT EXISTS stats ( id TEXT PRIMARY KEY, data TEXT NOT NULL ); 
    CREATE TABLE IF NOT EXISTS msgs ( id TEXT PRIMARY KEY, data TEXT NOT NULL ); 
    CREATE TABLE IF NOT EXISTS sticker ( id TEXT PRIMARY KEY, data TEXT NOT NULL ); 
    CREATE TABLE IF NOT EXISTS owners ( id TEXT PRIMARY KEY, data TEXT NOT NULL ); 
    CREATE TABLE IF NOT EXISTS blacklistUser ( id TEXT PRIMARY KEY, data TEXT NOT NULL ); 
    CREATE TABLE IF NOT EXISTS meta ( id TEXT PRIMARY KEY, data TEXT NOT NULL );
  `;
}

export class SqlJsDatabase {
  constructor(dbFile = 'database.sqlite') {
    this.file = path.resolve(dbFile);
    this.backupFile = `${this.file}.bak`;
    this.sql = null;
    this.SQL = null;
    this.saving = false;
    this.writeAgain = false;
    this.writePromise = null;
    this.dirty = true;
    this.lastSaved = 0;
    this.initialized = false;
    this.data = createEmptyData();
  }

  get user() { return this.data.users; }
  get users() { return this.data.users; }
  get chat() { return this.data.chats; }
  get chats() { return this.data.chats; }
  get setting() { return this.data.settings; }
  get settings() { return this.data.settings; }
  get stats() { return this.data.stats; }
  get msgs() { return this.data.msgs; }
  get sticker() { return this.data.sticker; }
  get owners() { return this.data.owners; }
  get blacklistUser() { return this.data.blacklistUser; }

  /* ========================================================
   * FILE HELPERS
   * ======================================================== */
  async atomicWrite(file, bytes) {
    const directory = path.dirname(file);
    await fs.promises.mkdir(directory, { recursive: true });
    const tempFile = `${file}.tmp-${process.pid}-${Date.now()}`;
    try {
      await fs.promises.writeFile(tempFile, bytes);
      await fs.promises.rename(tempFile, file);
    } catch (error) {
      try {
        await fs.promises.unlink(tempFile);
      } catch {}
      throw error;
    }
  }

  /* ========================================================
   * OPEN + VALIDATE SQLITE DATABASE
   * ======================================================== */
  openCandidate(bytes, source = 'database') {
    let sql;
    try {
      if (!bytes || bytes.length === 0) {
        throw new Error('File database kosong.');
      }
      
      sql = new this.SQL.Database(bytes);
      const integrity = sql.exec('PRAGMA integrity_check;');
      const integrityResult = integrity?.[0]?.values?.[0]?.[0];
      
      if (integrityResult !== 'ok') {
        throw new Error(`SQLite integrity_check gagal: ${integrityResult || 'unknown'}`);
      }
      
      const tablesResult = sql.exec(`SELECT name FROM sqlite_master WHERE type = 'table';`);
      const existingTables = new Set((tablesResult[0]?.values || []).map(row => row[0]));
      const knownTables = [...TABLES, 'owners', 'blacklistUser', 'meta'];
      
      for (const table of existingTables) {
        if (table !== 'sqlite_sequence' && !knownTables.includes(table)) {
          // Tabel tambahan tidak disentuh.
          continue;
        }
      }
      
      const resultData = createEmptyData();
      
      /*
       * Tabel dibuat setelah integrity_check.
       * Database versi lama boleh belum memiliki
       * semua tabel terbaru.
       */
      sql.run(getSchemas());
      
      for (const table of TABLES) {
        const rows = sql.exec(`SELECT id, data FROM "${table}";`);
        for (const [id, json] of rows[0]?.values || []) {
          const value = parseJSON(json, `${source}:${table}:${id}`);
          resultData[table][id] = value;
        }
      }
      
      const ownerRows = sql.exec('SELECT id, data FROM owners;');
      for (const [id, json] of ownerRows[0]?.values || []) {
        resultData.owners.push(parseJSON(json, `${source}:owners:${id}`));
      }
      
      const metaRows = sql.exec('SELECT id, data FROM meta;');
      for (const [id, json] of metaRows[0]?.values || []) {
        const value = parseJSON(json, `${source}:meta:${id}`);
        if (id === 'lastReset') {
          resultData.lastReset = value;
        }
      }
      
      /*
       * Mendukung database lama yang menyimpan
       * blacklistUser sebagai tabel tersendiri.
       * Sudah dimuat lewat TABLES di atas.
       */
      return {
        sql,
        data: resultData,
        records: getRowCount(resultData),
        source,
        bytes: Buffer.from(bytes)
      };
    } catch (error) {
      try {
        sql?.close();
      } catch {}
      throw new Error(`Tidak dapat memvalidasi ${source}: ${error.message}`);
    }
  }

  loadCandidate(file) {
    if (!fs.existsSync(file)) return null;
    const stat = fs.statSync(file);
    if (!stat.isFile() || stat.size === 0) {
      throw new Error(`File ${file} kosong atau bukan file valid.`);
    }
    const bytes = fs.readFileSync(file);
    return this.openCandidate(bytes, file);
  }

  /* ========================================================
   * LEGACY JSON MIGRATION
   * ======================================================== */
  importLegacy() {
    const legacyFile = path.resolve('database.json');
    if (!fs.existsSync(legacyFile)) {
      return false;
    }
    
    try {
      const raw = fs.readFileSync(legacyFile, 'utf8');
      const legacy = JSON.parse(raw);
      const source = legacy?.data && typeof legacy.data === 'object' ? legacy.data : legacy;
      let imported = false;
      
      for (const table of TABLES) {
        const value = source?.[table];
        if (
          value &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          Object.keys(this.data[table]).length === 0
        ) {
          this.data[table] = value;
          imported = true;
        }
      }
      
      if (Array.isArray(source?.owners) && this.data.owners.length === 0) {
        this.data.owners = source.owners;
        imported = true;
      }
      
      if (source?.lastReset !== undefined && this.data.lastReset == null) {
        this.data.lastReset = source.lastReset;
        imported = true;
      }
      
      if (imported) {
        console.log('[DATABASE] Data legacy database.json berhasil dibaca.');
      }
      
      return imported;
    } catch (error) {
      console.error('[DATABASE] Gagal membaca database.json:', error.message);
      return false;
    }
  }

  /* ========================================================
   * INITIALIZATION + AUTOMATIC RECOVERY
   * ======================================================== */
  async init() {
    if (this.initialized) return this;
    
    this.SQL = await initSqlJs();
    
    const primaryExists = fs.existsSync(this.file);
    const backupExists = fs.existsSync(this.backupFile);
    
    let primary = null;
    let backup = null;
    let primaryError = null;
    let backupError = null;
    
    if (primaryExists) {
      try {
        primary = this.loadCandidate(this.file);
      } catch (error) {
        primaryError = error;
        console.error('[DATABASE] Database utama gagal divalidasi:', error.message);
      }
    }
    
    if (backupExists) {
      try {
        backup = this.loadCandidate(this.backupFile);
      } catch (error) {
        backupError = error;
        console.error('[DATABASE] Backup gagal divalidasi:', error.message);
      }
    }
    
    let selected = null;
    let restored = false;
    
    /*
     * Aturan pemilihan:
     * 1. Database utama valid dipakai secara default.
     * 2. Jika utama kosong tetapi backup berisi data, gunakan backup.
     * 3. Jika utama rusak, gunakan backup valid.
     */
    if (primary && backup) {
      if (primary.records === 0 && backup.records > 0) {
        selected = backup;
        restored = true;
      } else {
        selected = primary;
      }
    } else if (primary) {
      selected = primary;
    } else if (backup) {
      selected = backup;
      restored = true;
    }
    
    if (selected) {
      this.sql = selected.sql;
      this.data = selected.data;
      
      /*
       * Tutup koneksi kandidat yang tidak dipakai.
       */
      for (const candidate of [primary, backup]) {
        if (candidate && candidate !== selected) {
          try {
            candidate.sql.close();
          } catch {}
        }
      }
      
      if (restored) {
        console.warn('[DATABASE] Memulihkan database dari backup...');
        await this.atomicWrite(this.file, selected.bytes);
        console.log('[DATABASE] Database berhasil dipulihkan.');
      } else {
        console.log(`[DATABASE] Database utama valid (${selected.records} record).`);
      }
    } else {
      /*
       * Jangan diam-diam membuat database kosong jika
       * file sebelumnya ada tetapi rusak.
       *
       * Pengecualian: database.json lama masih bisa
       * menjadi sumber migrasi.
       */
      const hadDatabaseFiles = primaryExists || backupExists;
      
      if (hadDatabaseFiles) {
        console.error('[DATABASE] Database utama/backup tidak dapat dipulihkan.');
        this.sql = new this.SQL.Database();
        this.data = createEmptyData();
        this.sql.run(getSchemas());
        
        const imported = this.importLegacy();
        if (!imported) {
          try {
            this.sql.close();
          } catch {}
          throw new Error(
            'Database utama dan backup rusak, dan tidak ada data legacy yang dapat dipulihkan. ' +
            'File asli dipertahankan. Jangan hapus database.sqlite atau database.sqlite.bak.'
          );
        }
        console.warn('[DATABASE] Melakukan pemulihan dari database.json.');
      } else {
        /*
         * Instalasi baru: tidak ada database utama
         * ataupun backup sebelumnya.
         */
        this.sql = new this.SQL.Database();
        this.data = createEmptyData();
        this.sql.run(getSchemas());
        this.importLegacy();
      }
    }
    
    /*
     * Menormalkan skema lama dan memastikan database
     * tersimpan dalam format terbaru.
     */
    this.sql.run(getSchemas());
    this.initialized = true;
    this.dirty = true;
    
    await this.write();
    console.log(
      `[DATABASE] Init selesai | Users: ${Object.keys(this.data.users).length} | ` +
      `Chats: ${Object.keys(this.data.chats).length}`
    );
    
    return this;
  }

  /* ========================================================
   * ENSURE USER / CHAT / SETTINGS
   * ======================================================== */
  ensure(m, conn) {
    if (!m) return;
    
    const sender = m.sender;
    if (sender && sender.endsWith('@s.whatsapp.net')) {
      let user = this.data.users[sender];
      if (!user || typeof user !== 'object' || Array.isArray(user)) {
        user = this.data.users[sender] = { ...defaultUser, name: m.name || '' };
        this.dirty = true;
      } else {
        for (const key in defaultUser) {
          if (!(key in user)) {
            user[key] = defaultUser[key];
            this.dirty = true;
          }
        }
        if (m.name && !user.name) {
          user.name = m.name;
          this.dirty = true;
        }
      }
    }
    
    const chatJid = m.chat;
    if (m.isGroup && chatJid) {
      let chat = this.data.chats[chatJid];
      if (!chat || typeof chat !== 'object' || Array.isArray(chat)) {
        this.data.chats[chatJid] = { ...defaultChat };
        this.dirty = true;
      } else {
        for (const key in defaultChat) {
          if (!(key in chat)) {
            chat[key] = defaultChat[key];
            this.dirty = true;
          }
        }
      }
    }
    
    const botJid = conn?.user?.jid;
    if (botJid) {
      let settings = this.data.settings[botJid];
      if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
        this.data.settings[botJid] = { ...defaultSettings };
        this.dirty = true;
      } else {
        for (const key in defaultSettings) {
          if (!(key in settings)) {
            settings[key] = defaultSettings[key];
            this.dirty = true;
          }
        }
      }
    }
  }

  /* ========================================================
   * SERIALIZE SNAPSHOT
   * ======================================================== */
  createSnapshot() {
    const snapshot = {};
    for (const table of TABLES) {
      const source = this.data[table];
      if (!source || typeof source !== 'object' || Array.isArray(source)) {
        throw new Error(`Struktur tabel ${table} tidak valid.`);
      }
      snapshot[table] = [];
      for (const [id, value] of Object.entries(source)) {
        const json = JSON.stringify(value);
        if (json === undefined) {
          throw new Error(`Data ${table}:${id} tidak bisa diserialisasi.`);
        }
        snapshot[table].push([id, json]);
      }
    }
    
    if (!Array.isArray(this.data.owners)) {
      throw new Error('Struktur owners tidak valid.');
    }
    
    snapshot.owners = this.data.owners.map((item, index) => {
      const id = Array.isArray(item)
        ? String(item[0] ?? index)
        : String(item?.id ?? item ?? index);
      const json = JSON.stringify(item);
      if (json === undefined) {
        throw new Error(`Owner index ${index} tidak bisa diserialisasi.`);
      }
      return [id, json];
    });
    
    snapshot.meta = [
      ['lastReset', JSON.stringify(this.data.lastReset ?? null)]
    ];
    
    return snapshot;
  }

  /* ========================================================
   * VALIDATE EXISTING FILE BEFORE BACKUP
   * ======================================================== */
  async backupCurrentDatabase() {
    if (!fs.existsSync(this.file)) return;
    
    let current;
    let backup;
    
    try {
      current = this.loadCandidate(this.file);
    } catch (error) {
      console.warn(
        '[DATABASE] File utama di disk tidak valid; backup lama dipertahankan:',
        error.message
      );
      return;
    }
    
    try {
      if (fs.existsSync(this.backupFile)) {
        backup = this.loadCandidate(this.backupFile);
      }
    } catch {
      backup = null;
    }
    
    try {
      /*
       * Jangan mengganti backup yang memiliki lebih banyak
       * record dengan file utama yang kosong/lebih sedikit.
       */
      if (backup && current.records < backup.records) {
        console.warn('[DATABASE] Backup lama lebih lengkap; backup dipertahankan.');
        return;
      }
      const bytes = fs.readFileSync(this.file);
      await this.atomicWrite(this.backupFile, bytes);
    } finally {
      try {
        current?.sql.close();
      } catch {}
      try {
        backup?.sql.close();
      } catch {}
    }
  }

  /* ========================================================
   * WRITE DATABASE
   *
   * Writes are serialized. If write() is called during an
   * active save, another pass is queued instead of discarded.
   * ======================================================== */
  async write() {
    if (!this.sql || !this.initialized) {
      /*
       * init() performs the initial write after setting
       * initialized = true.
       */
      return;
    }
    
    if (this.saving) {
      this.writeAgain = true;
      return this.writePromise;
    }
    
    this.saving = true;
    this.writePromise = (async () => {
      try {
        do {
          this.writeAgain = false;
          
          /*
           * Serialize before opening the transaction.
           * Invalid data will not partially overwrite
           * the on-disk database.
           */
          const snapshot = this.createSnapshot();
          this.sql.run('BEGIN TRANSACTION;');
          
          try {
            for (const table of TABLES) {
              this.sql.run(`DELETE FROM "${table}";`);
              const statement = this.sql.prepare(`INSERT INTO "${table}" (id, data) VALUES (?, ?);`);
              try {
                for (const row of snapshot[table]) {
                  statement.run(row);
                }
              } finally {
                statement.free();
              }
            }
            
            this.sql.run('DELETE FROM owners;');
            const ownerStatement = this.sql.prepare('INSERT INTO owners (id, data) VALUES (?, ?);');
            try {
              for (const row of snapshot.owners) {
                ownerStatement.run(row);
              }
            } finally {
              ownerStatement.free();
            }
            
            this.sql.run('DELETE FROM meta;');
            const metaStatement = this.sql.prepare('INSERT INTO meta (id, data) VALUES (?, ?);');
            try {
              for (const row of snapshot.meta) {
                metaStatement.run(row);
              }
            } finally {
              metaStatement.free();
            }
            
            this.sql.run('COMMIT;');
          } catch (error) {
            try {
              this.sql.run('ROLLBACK;');
            } catch {}
            throw error;
          }
          
          /*
           * Export database in memory. Before replacing
           * the main file, preserve a validated previous
           * version as .bak.
           */
          const binaryArray = this.sql.export();
          const bytes = Buffer.from(binaryArray);
          
          await this.backupCurrentDatabase();
          await this.atomicWrite(this.file, bytes);
          
          this.dirty = false;
          this.lastSaved = Date.now();
        } while (this.writeAgain);
      } catch (error) {
        this.dirty = true;
        console.error('[DATABASE] Error saving SQLite database:', error);
        throw error;
      } finally {
        this.saving = false;
        this.writePromise = null;
      }
    })();
    
    return this.writePromise;
  }

  /* ========================================================
   * REPAIR
   * ======================================================== */
  async repair() {
    if (!this.sql || !this.initialized) {
      console.error('[DATABASE] Repair gagal: database belum diinisialisasi.');
      return false;
    }
    
    try {
      const integrity = this.sql.exec('PRAGMA integrity_check;');
      const result = integrity?.[0]?.values?.[0]?.[0];
      if (result !== 'ok') {
        console.error('[DATABASE] Integrity check gagal:', result);
        return false;
      }
      
      /*
       * Periksa record yang ada dalam memori.
       * Jangan menghapus user hanya karena satu field
       * belum tersedia.
       */
      for (const table of TABLES) {
        const records = this.data[table];
        if (!records || typeof records !== 'object' || Array.isArray(records)) {
          throw new Error(`Struktur tabel ${table} tidak valid.`);
        }
      }
      
      if (!Array.isArray(this.data.owners)) {
        throw new Error('Struktur tabel owners tidak valid.');
      }
      
      /*
       * Validasi semua data sebelum menyimpan.
       */
      this.createSnapshot();
      await this.write();
      console.log('[DATABASE] Repair berhasil.');
      return true;
    } catch (error) {
      console.error('[DATABASE] Repair gagal:', error.message);
      return false;
    }
  }

  /* ========================================================
   * READ
   * ======================================================== */
  read() {
    return Promise.resolve(this.data);
  }
}

/* ============================================================
 * DEFAULT EXPORT — KOMPATIBILITAS PLUGIN LAMA
 * ============================================================ */
export default async function (m, conn) {
  if (global.db && typeof global.db.ensure === 'function') {
    global.db.ensure(m, conn);
  }
}