import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const BASE_URL = "https://photoai.imglarger.com/api/PhoAi";
const REQUEST_TIMEOUT = 60000;

const headers = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  "origin": "https://imglarger.com",
  "referer": "https://imglarger.com/",
  "user-agent":
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
};

async function upload(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error("file_not_found");
  }

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("type", "13");
  form.append("scaleRadio", "2");

  const { data } = await axios.post(`${BASE_URL}/Upload`, form, {
    headers: {
      ...form.getHeaders(),
      ...headers,
    },
    timeout: REQUEST_TIMEOUT,
    maxBodyLength: 50 * 1024 * 1024,
    maxContentLength: 10 * 1024 * 1024,
  });

  const result = data?.data;

  if (!result?.code) {
    throw new Error(
      result?.message || data?.message || "upload_rejected",
    );
  }

  return result;
}

async function get(code) {
  if (!code) {
    throw new Error("missing_code");
  }

  const { data } = await axios.post(
    `${BASE_URL}/CheckStatus`,
    {
      code,
      type: 13,
      isMember: 0,
    },
    {
      headers: {
        ...headers,
        "content-type": "application/json",
      },
      timeout: REQUEST_TIMEOUT,
    },
  );

  const result = data?.data;

  if (!result) {
    throw new Error(data?.message || "invalid_status_response");
  }

  // Keep the original API response intact, while normalizing common status
  // names so the plugin can handle both old and current API responses.
  const rawStatus = String(result.status || "").toLowerCase();

  let status = rawStatus;
  if (["pending", "processing", "waiting"].includes(rawStatus)) {
    status = "waiting";
  } else if (["done", "completed", "finish", "finished"].includes(rawStatus)) {
    status = "success";
  }

  return {
    ...result,
    status,
    downloadUrls: Array.isArray(result.downloadUrls)
      ? result.downloadUrls.filter((url) => typeof url === "string" && url)
      : [],
  };
}

export { upload, get };
