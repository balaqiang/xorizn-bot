import axios from "axios";

const PINTEREST_BASE = "https://www.pinterest.com";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";

function pickImage(images = {}) {
  for (const key of ["orig", "736x", "564x", "474x", "236x"]) {
    const value = images?.[key];
    if (value?.url) return value.url;
  }
  return null;
}

function normalizePin(item) {
  if (!item || item.type === "story") return null;

  const imageUrl = pickImage(item.images);
  if (!imageUrl) return null;

  const id = item.id || "";
  return {
    id,
    image_url: imageUrl,
    title:
      item.title ||
      item.grid_title ||
      item.name ||
      item.auto_alt_text ||
      item.pin_join?.visual_annotation?.[0] ||
      "Pinterest",
    description:
      item.description ||
      item.seo_description ||
      item.rich_summary?.display_description ||
      "",
    pin_url: item.link || (id ? `${PINTEREST_BASE}/pin/${id}/` : ""),
  };
}

/**
 * Search public Pinterest pins without depending on the old third-party
 * cuki.biz.id endpoint. Pinterest's web client currently exposes the same
 * BaseSearchResource used by several open-source search integrations.
 */
export async function searchPinterest(query, limit = 10) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 10, 20));
  const data = {
    options: {
      query: String(query).trim(),
      bookmarks: [""],
    },
    context: {},
  };

  const url = `${PINTEREST_BASE}/resource/BaseSearchResource/get/`;
  const response = await axios.get(url, {
    params: { data: JSON.stringify(data), _: Date.now() },
    timeout: 15000,
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "User-Agent": USER_AGENT,
      "X-Requested-With": "XMLHttpRequest",
      "X-Pinterest-AppState": "active",
      "X-Pinterest-Source-Url": "/ideas/",
      "X-Pinterest-PWS-Handler": "www/ideas.js",
      Referer: `${PINTEREST_BASE}/ideas/`,
    },
    validateStatus: (status) => status >= 200 && status < 400,
  });

  const results = response.data?.resource_response?.data?.results;
  if (!Array.isArray(results)) {
    throw new Error("Format respons Pinterest tidak dikenali");
  }

  return results
    .map(normalizePin)
    .filter(Boolean)
    .slice(0, safeLimit);
}
