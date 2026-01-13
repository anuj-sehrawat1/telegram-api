import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { target } = req.query;
  if (!target) return res.status(400).json({ error: "target required" });

  let url = target;

  if (!url.startsWith("http")) {
    url = `https://t.me/${target.replace("@", "")}`;
  }

  let urlType = "profile";
  let entityType = "user";
  let privacy = "public";
  let inviteCode = null;
  let postId = null;
  let commentId = null;

  // URL classification
  if (url.includes("/addstickers/")) urlType = "feature";
  else if (url.includes("/addemoji/")) urlType = "feature";
  else if (url.includes("/addtheme/")) urlType = "feature";
  else if (url.includes("?start=") || url.includes("startgroup"))
    urlType = "feature";
  else if (url.includes("/joinchat/") || url.includes("t.me/+")) {
    urlType = "invite";
    privacy = "private";
    inviteCode = url.split("/").pop();
  } else if (url.match(/\/\d+/)) {
    urlType = "post";
    postId = url.match(/\/(\d+)/)?.[1] || null;
    commentId = new URL(url).searchParams.get("comment");
  }

  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      maxRedirects: 5,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
      },
    });

    const $ = cheerio.load(data);

    const text = (s) => $(s).text().trim() || null;
    const attr = (s, a) => $(s).attr(a) || null;

    const name =
      text(".tgme_page_title span") ||
      attr('meta[property="og:title"]', "content");

    const description =
      text(".tgme_page_description") ||
      attr('meta[property="og:description"]', "content");

    const photo =
      attr(".tgme_page_photo_image img", "src") ||
      attr('meta[property="og:image"]', "content");

    const extras = $(".tgme_page_extra")
      .map((_, el) => $(el).text().trim())
      .get();

    let subscribers = null;
    let members = null;
    let monthlyUsers = null;

    for (const e of extras) {
      if (/subscribers/i.test(e)) {
        entityType = "channel";
        subscribers = parseInt(e.replace(/\D/g, "")) || null;
      }
      if (/members/i.test(e)) {
        entityType = "group";
        members = parseInt(e.replace(/\D/g, "")) || null;
      }
      if (/monthly users/i.test(e)) {
        entityType = "bot";
        monthlyUsers = parseInt(e.replace(/\D/g, "")) || null;
      }
    }

    const isForum = $(".tgme_forum").length > 0;
    const discussionEnabled = $(".tgme_page_discussion").length > 0;

    return res.json({
      success: true,
      url_type: urlType,
      entity_type: entityType,
      privacy,
      username: url.includes("t.me/")
        ? "@" + url.split("t.me/")[1]?.split("/")[0]
        : null,
      invite_code: inviteCode,

      profile: {
        name,
        photo,
        description,
        verified: $(".verified-icon").length > 0,
        restricted: $(".tgme_page_restricted").length > 0,
        fake: $(".tgme_page_fake").length > 0,
        scam: $(".tgme_page_scam").length > 0,
      },

      stats: {
        subscribers,
        members,
        monthly_users: monthlyUsers,
      },

      group: {
        is_supergroup: members > 200,
        is_forum: isForum,
        topics_enabled: isForum,
      },

      channel: {
        discussion_enabled: discussionEnabled,
      },

      post: {
        post_id: postId,
        comment_id: commentId,
        text: text(".tgme_widget_message_text"),
      },

      feature: {
        type:
          urlType === "feature"
            ? url.split("/")[3]
            : null,
        value: url.split("/").pop(),
      },

      raw: {
        extras,
      },
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      error: "Not found / private / rate-limited",
    });
  }
}
