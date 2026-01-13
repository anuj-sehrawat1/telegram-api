import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "username query param required" });
  }

  const url = `https://t.me/${username}`;

  try {
    const { data } = await axios.get(url, {
      maxRedirects: 5,
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
        Accept: "text/html",
      },
    });

    const $ = cheerio.load(data);

    // Basic fields
    const name =
      $(".tgme_page_title span").text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      null;

    const profilePic =
      $(".tgme_page_photo_image img").attr("src") ||
      $('meta[property="og:image"]').attr("content") ||
      null;

    const description =
      $(".tgme_page_description").text().trim() ||
      $('meta[property="og:description"]').attr("content") ||
      null;

    const extras = $(".tgme_page_extra")
      .map((_, el) => $(el).text().trim())
      .get();

    let type = "user";
    let subscribers = null;
    let monthlyUsers = null;

    for (const text of extras) {
      if (/subscribers|members/i.test(text)) {
        type = "channel";
        subscribers = text.match(/\d[\d\s]*/)?.[0]?.replace(/\s/g, "") || null;
      }

      if (/monthly users/i.test(text)) {
        type = "bot";
        monthlyUsers = text.match(/\d[\d\s]*/)?.[0]?.replace(/\s/g, "") || null;
      }
    }

    if (url.includes("/bot")) type = "bot";

    return res.status(200).json({
      success: true,
      type,
      name,
      username: `@${username}`,
      subscribers,
      monthlyUsers,
      description,
      profilePic,
      sourceUrl: url,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      error: "Profile not found or private",
    });
  }
}
