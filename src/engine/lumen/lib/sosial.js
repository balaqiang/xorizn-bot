import Builder from 'baileys-mbuilder'

const { AIRich } = Builder

export async function sendSocialMedia(conn, jid, quoted) {
    const pp = 'https://raw.githubusercontent.com/hamm-r/uploader/main/1781490591785-389.jpg'

    return await new AIRich(conn)
        .addPost([
            {
                username: 'Hamdan maulana',
                profile_url: pp,
                title: 'Hamdan maulana',
                subtitle: 'Facebook',
                caption: 'AYO BERTEMAN DI PESNUK',
                verified: true,
                url: 'https://www.facebook.com/share/1KsR3QQfJb/',
                thumbnail: pp,
                source: 'FACEBOOK',
                footer: 'Facebook',
                deeplink: 'https://www.facebook.com/share/1KsR3QQfJb/',
                icon: pp,
                orientation: 'LANDSCAPE',
                post_type: 'PHOTO',
                like: 0,
                comment: 0,
                share: 0
            },
            {
                username: 'xorizn-bot',
                profile_url: 'https://raw.githubusercontent.com/hamm-r/uploader/main/1781490623255-859.jpg',
                title: 'xorizn-bot',
                subtitle: 'Threads',
                caption: 'bukan threads ini tiktok follow tiktok mimin yh',
                verified: true,
                url: 'https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R',
                thumbnail: 'https://raw.githubusercontent.com/hamm-r/uploader/main/1781490623255-859.jpg',
                source: 'THREADS',
                footer: 'Threads',
                deeplink: 'https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R',
                icon: 'https://raw.githubusercontent.com/hamm-r/uploader/main/1781490623255-859.jpg',
                orientation: 'LANDSCAPE',
                post_type: 'PHOTO',
                like: 0,
                comment: 0,
                share: 0
            },
            {
                username: 'xorizn-bot',
                profile_url: pp,
                title: 'xorizn-bot',
                subtitle: 'Instagram',
                caption: 'yoo follow ig gw jga',
                verified: true,
                url: 'https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R',
                thumbnail: pp,
                source: 'INSTAGRAM',
                footer: 'Instagram',
                deeplink: 'https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R',
                icon: pp,
                orientation: 'LANDSCAPE',
                post_type: 'PHOTO',
                like: 0,
                comment: 0,
                share: 0
            }
        ])
        .send(jid, { quoted })
}