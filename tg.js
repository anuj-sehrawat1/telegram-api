import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "username query param required" });
  }

  try {
    const url = `https://t.me/${username}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const $ = cheerio.load(data);

    // Common fields
    const name =
      $(".tgme_page_title span").text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      null;

    const profilePic =
      $(".tgme_page_photo_image").attr("src") ||
      $('meta[property="og:image"]').attr("content") ||
      null;

    const description =
      $(".tgme_page_description").text().trim() ||
      $('meta[property="og:description"]').attr("content") ||
      null;

    const extras = $(".tgme_page_extra")
      .map((i, el) => $(el).text().trim())
      .get();

    let type = "user";
    let subscribers = null;
    let usernameText = null;
    let monthlyUsers = null;

    if (extras.length > 0) {
      // bot
      if (extras[0].startsWith("@") && extras.length > 1) {
        type = "bot";
        usernameText = extras[0];
        monthlyUsers = extras[1];
      }
      // channel
      else if (extras[0].match(/subscribers|members/i)) {
        type = "channel";
        subscribers = extras[0];
      }
      // normal user
      else {
        type = "user";
        usernameText = extras[0];
      }
    }

    return res.status(200).json({
      type,
      name,
      username: usernameText,
      subscribers,
      monthlyUsers,
      description,
      profilePic,
      sourceUrl: url,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to scrape profile" });
  }
      }
