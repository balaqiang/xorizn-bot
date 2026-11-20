import https from 'https';
import crypto from 'crypto';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0';
const HOME = 'https://gemini.google.com/app';
const ENDPOINT = 'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate';

const hex = (n) => crypto.randomBytes(n).toString('hex');
const uuid = () => crypto.randomUUID().toUpperCase();
const reqid = () => Math.floor(Math.random() * 900000) + 100000;
const pack = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64');
const unpack = (s) => {
    try {
        return JSON.parse(Buffer.from(s, 'base64').toString());
    } catch {
        return null;
    }
};

function request(url, options = {}) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const req = https.request({
            protocol: u.protocol,
            hostname: u.hostname,
            port: u.port || 443,
            path: u.pathname + u.search,
            method: options.method || 'GET',
            headers: options.headers || {},
            maxHeaderSize: 1024 * 1024
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    data
                });
            });
        });

        req.on('error', reject);
        if (options.body) {
            req.write(options.body);
        }
        req.end();
    });
}

async function bootstrap() {
    const res = await request(HOME, {
        headers: {
            'User-Agent': UA,
            'Accept-Language': 'en-US,en;q=0.9'
        }
    });

    const setCookies = res.headers['set-cookie'] || [];
    const cookie = setCookies.map((c) => c.split(';')[0]).join('; ');
    const html = typeof res.data === 'string' ? res.data : String(res.data);

    return {
        cookie,
        bl: (html.match(/"cfb2h":"(.*?)"/) || [])[1] || '',
        fsid: (html.match(/"FdrFJe":"(.*?)"/) || [])[1] || '',
        uid: uuid()
    };
}

function buildBody(message, resume, uid) {
    const inner = [
        [message, 0, null, null, null, null, 0],
        ['en-US'],
        resume,
        '',
        hex(16),
        null,
        [1],
        1,
        null,
        null,
        1,
        0,
        null,
        null,
        null,
        null,
        null,
        [[0]],
        0,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        1,
        null,
        null,
        [4],
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        [2],
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        0,
        null,
        null,
        null,
        null,
        null,
        uid,
        null,
        [],
        null,
        null,
        null,
        null,
        null,
        null,
        2,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        1
    ];
    return 'f.req=' + encodeURIComponent(JSON.stringify([null, JSON.stringify(inner)])) + '&';
}

function parseReply(raw) {
    const out = { text: '', conversationId: null, responseId: null, replyId: null };
    let best = '';
    for (const line of (raw || '').split('\n')) {
        const s = line.trim();
        if (!s.startsWith('[["wrb.fr"')) continue;
        let outer;
        try {
            outer = JSON.parse(s);
        } catch {
            continue;
        }
        for (const row of outer) {
            if (!Array.isArray(row) || row[0] !== 'wrb.fr' || typeof row[2] !== 'string') continue;
            let body;
            try {
                body = JSON.parse(row[2]);
            } catch {
                continue;
            }
            const ids = body[1];
            if (Array.isArray(ids)) {
                if (typeof ids[0] === 'string' && ids[0].startsWith('c_')) out.conversationId = ids[0];
                if (typeof ids[1] === 'string' && ids[1].startsWith('r_')) out.responseId = ids[1];
            }
            const seg = Array.isArray(body[4]) ? body[4][0] : null;
            if (seg) {
                if (seg[0]) out.replyId = seg[0];
                if (Array.isArray(seg[1])) {
                    const piece = seg[1].join('');
                    if (piece.length > best.length) best = piece;
                }
            }
        }
    }
    out.text = best.trim();
    return out;
}

export async function geminiChat(message, options = {}) {
    const sess = options.sessionId ? unpack(options.sessionId) : null;
    const ctx = sess && sess.cookie ? sess : await bootstrap();
    const resume =
        sess && sess.resume
            ? [sess.resume[0] || '', sess.resume[1] || '', sess.resume[2] || '', null, null, null, null, null, null, '']
            : ['', '', '', null, null, null, null, null, null, ''];

    const url = `${ENDPOINT}?bl=${encodeURIComponent(ctx.bl)}&f.sid=${encodeURIComponent(ctx.fsid)}&hl=en-US&_reqid=${reqid()}&rt=c`;
    const res = await request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'User-Agent': UA,
            'Origin': 'https://gemini.google.com',
            'Referer': 'https://gemini.google.com/',
            'X-Same-Domain': '1',
            'x-goog-ext-525001261-jspb': JSON.stringify([1, null, null, null, hex(8), null, null, 0, [4, 6], null, null, 1, null, null, 1, null, uuid()]),
            'x-goog-ext-525005358-jspb': JSON.stringify([ctx.uid, 1]),
            'x-goog-ext-73010990-jspb': '[0,0,0]',
            'x-goog-ext-73010989-jspb': '[0]',
            'Cookie': ctx.cookie
        },
        body: buildBody(String(message), resume, ctx.uid)
    });

    const reply = parseReply(res.data);
    const ok = res.status === 200 && Boolean(reply.text);

    return {
        status: res.status,
        response: reply.text || null,
        sessionId: ok
            ? pack({
                  cookie: ctx.cookie,
                  bl: ctx.bl,
                  fsid: ctx.fsid,
                  uid: ctx.uid,
                  resume: [reply.conversationId, reply.responseId, reply.replyId]
              })
            : options.sessionId || null
    };
}

export default geminiChat;