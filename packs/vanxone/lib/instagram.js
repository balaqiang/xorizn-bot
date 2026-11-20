/**
 * Instagram Profile Stalker & Inspector (Pure Node.js)
 * 
 * Engine scraper profil Instagram tanpa sesi login / cookies.
 * Mengambil nama lengkap, bio, jumlah followers, following, total postingan,
 * status centang biru (verified), status akun private, dan link foto profil avatar.
 * 
 * Base Scraping: https://www.instagram.com/
 * Platform: VamxAPI (https://vamxapi.my.id)
 * Author: Vamz Spectre (@fhmz76)
 */

const axios = require("axios");
const cheerio = require("cheerio");

function formatCount(n) {
  if (!n || isNaN(n)) return "0";
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "M";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "jt";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "rb";
  return String(n);
}

function parseMetric(s) {
  if (!s) return 0;
  const clean = s.replace(/,/g, "").trim();
  if (clean.endsWith("M") || clean.endsWith("m")) return Math.round(parseFloat(clean) * 1e6);
  if (clean.endsWith("K") || clean.endsWith("k")) return Math.round(parseFloat(clean) * 1e3);
  if (clean.endsWith("B") || clean.endsWith("b")) return Math.round(parseFloat(clean) * 1e9);
  return parseInt(clean, 10) || 0;
}

/**
 * Stalk profil Instagram secara akurat
 * @param {string} rawUsername - Username Instagram (dengan atau tanpa @)
 * @returns {Promise<Object>} Data profil lengkap
 */
async function stalkInstagram(rawUsername) {
  const cleanUsername = String(rawUsername).replace(/^@+/, "").trim();

  if (!cleanUsername || !/^[a-zA-Z0-9._]{1,30}$/.test(cleanUsername)) {
    throw new Error("Username Instagram tidak valid. Masukkan username tanpa spasi atau simbol.");
  }

  let followers = 0;
  let followersFormatted = "0";
  let following = 0;
  let followingFormatted = "0";
  let posts = 0;
  let postsFormatted = "0";
  let fullName = cleanUsername;
  let bio = "";
  let isVerified = false;
  let isPrivate = false;
  let avatarUrl = "";
  let found = false;

  // 1. Primary Engine: Server-rendered Embed Endpoint
  try {
    const embedRes = await axios.get(`https://www.instagram.com/${cleanUsername}/embed/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 8000,
      validateStatus: (s) => s < 500,
    });

    const html = embedRes.data || "";

    if (
      embedRes.status === 404 ||
      html.includes("Page Not Found") ||
      html.includes("Sorry, this page isn't available.")
    ) {
      throw new Error(`Akun Instagram '@${cleanUsername}' tidak ditemukan.`);
    }

    if (html.includes("followers_count") || html.includes("full_name")) {
      found = true;
      const followersM = html.match(/followers_count[^\d]*(\d+)/);
      const postsM = html.match(/posts_count[^\d]*(\d+)/);
      const verifiedM = html.match(/(?:is_verified|verified)[^\w]*(true|false)/);
      const privateM = html.match(/is_private[^\w]*(true|false)/);
      const fullNameM = html.match(/full_name\\*":\\*"([^"]+?)\\*",/);
      const picM = html.match(/profile_pic_url\\*":\\*"(https:[^"]+?)\\*",/);

      if (followersM) {
        followers = parseInt(followersM[1], 10);
        followersFormatted = formatCount(followers);
      }
      if (postsM) {
        posts = parseInt(postsM[1], 10);
        postsFormatted = formatCount(posts);
      }
      if (verifiedM) isVerified = verifiedM[1] === "true";
      if (privateM) isPrivate = privateM[1] === "true";
      if (fullNameM && fullNameM[1]) {
        try {
          fullName = JSON.parse(`"${fullNameM[1].replace(/\\\\/g, "\\")}"`);
        } catch {
          fullName = fullNameM[1];
        }
      }
      if (picM && picM[1]) {
        avatarUrl = picM[1]
          .replace(/\\\//g, "/")
          .replace(/\\\\/g, "")
          .replace(/\\u0026/g, "&")
          .replace(/\\u00253D/g, "=")
          .replace(/\\u0025/g, "%");
      }
    }
  } catch (err) {
    if (err.message && err.message.includes("tidak ditemukan")) throw err;
  }

  // 2. Secondary Enrichment Engine: Googlebot Crawler Metadata (Followers, Following, Bio)
  try {
    const crawlerRes = await axios.get(`https://www.instagram.com/${cleanUsername}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 6000,
      validateStatus: (s) => s < 500,
    });

    if (crawlerRes.status === 200 && typeof crawlerRes.data === "string") {
      const $ = cheerio.load(crawlerRes.data);
      const descMeta =
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content") ||
        "";
      const ogTitle = $('meta[property="og:title"]').attr("content") || "";
      const ogImage = $('meta[property="og:image"]').attr("content") || "";

      if (descMeta && (descMeta.includes("Followers") || descMeta.includes("Following"))) {
        found = true;
        const descMatch = descMeta.match(
          /([0-9.,KMBkmb]+)\s+Followers,\s+([0-9.,KMBkmb]+)\s+Following,\s+([0-9.,KMBkmb]+)\s+Posts/i
        );
        if (descMatch) {
          followers = parseMetric(descMatch[1]);
          followersFormatted = descMatch[1];
          following = parseMetric(descMatch[2]);
          followingFormatted = descMatch[2];
          posts = parseMetric(descMatch[3]);
          postsFormatted = descMatch[3];
        }

        const titleMatch = (ogTitle || $("title").text()).match(/^(.*?)(?:\s*\(@|\s*•)/);
        if (titleMatch && titleMatch[1].trim()) {
          fullName = titleMatch[1].trim();
        }

        const bioMatch = descMeta.match(/on Instagram:\s*"([\s\S]*?)"\s*$/);
        if (bioMatch && bioMatch[1]) {
          bio = bioMatch[1].trim();
        }

        if (ogImage && !avatarUrl) {
          avatarUrl = ogImage;
        }

        const titleText = $("title").text();
        if (titleText.includes("InstagramVerified") || titleText.includes("VerifiedOptions")) {
          isVerified = true;
        }
      }
    }
  } catch {}

  if (!found) {
    throw new Error(`Akun Instagram '@${cleanUsername}' tidak ditemukan atau privat.`);
  }

  return {
    status: true,
    result: {
      username: cleanUsername,
      full_name: fullName,
      biography: bio,
      is_verified: isVerified,
      is_private: isPrivate,
      followers,
      followers_formatted: followersFormatted,
      following,
      following_formatted: followingFormatted,
      posts,
      posts_formatted: postsFormatted,
      avatar_url: avatarUrl,
      profile_url: `https://instagram.com/${cleanUsername}`,
    },
  };
}

module.exports = { stalkInstagram };

// Pengujian Langsung CLI:
if (require.main === module) {
  const target = process.argv[2] || "fhmz76";
  console.log(`🔍 Sedang melakukan stalk profil Instagram: @${target}...`);
  stalkInstagram(target)
    .then((res) => console.log(JSON.stringify(res, null, 2)))
    .catch((err) => console.error("❌ Gagal:", err.message));
}
