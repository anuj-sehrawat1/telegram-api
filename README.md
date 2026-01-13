<!-- README.md -->

<h1 align="center">📡 Telegram Public Scraper API</h1>

<p align="center">
  A fast, reliable, and production-ready API to scrape <b>public Telegram pages</b> using <code>t.me</code> URLs.
</p>

<p align="center">
  <a href="https://telegram-api-vert.vercel.app/api/tg?target=BotFather" target="_blank">
    🔗 Live API Demo
  </a>
</p>

<hr/>

<h2>🚀 Overview</h2>

<p>
This API scrapes <b>publicly accessible Telegram web pages</b> and returns structured JSON data.
It supports <b>users, bots, channels, groups, forums, posts, invite links</b>, and several Telegram features.
</p>

<p>
⚠️ This API does <b>not use Telegram MTProto login</b>. It only scrapes data visible on <code>https://t.me</code>.
</p>

<hr/>

<h2>🌐 Base URL</h2>

<pre><code>https://telegram-api-vert.vercel.app/api/tg</code></pre>

<hr/>

<h2>📥 Request</h2>

<h3>Query Parameters</h3>

<table border="1" cellpadding="8">
  <tr>
    <th>Parameter</th>
    <th>Required</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>target</code></td>
    <td>✅ Yes</td>
    <td>
      Telegram target (username, @username, full URL, invite link, post URL)
    </td>
  </tr>
</table>

<h3>Examples</h3>

<pre><code>
/api/tg?target=BotFather
/api/tg?target=@telegram
/api/tg?target=https://t.me/telegram
/api/tg?target=https://t.me/+AbCdEfGh
/api/tg?target=https://t.me/channelname/123
</code></pre>

<hr/>

<h2>✅ Supported Telegram Targets</h2>

<ul>
  <li>👤 Public Users</li>
  <li>🤖 Bots (Normal / Inline / Utility)</li>
  <li>📢 Public Channels</li>
  <li>👥 Public Groups</li>
  <li>🏟 Supergroups</li>
  <li>💬 Forum Groups (Topics enabled)</li>
  <li>🔒 Private Invite Links</li>
  <li>📝 Posts / Messages</li>
  <li>💬 Comment Threads</li>
  <li>🎁 Stickers / Emoji Packs / Themes</li>
  <li>⚙️ Bot start & startgroup parameters</li>
</ul>

<hr/>

<h2>📤 Response Structure</h2>

<pre><code>{
  "success": true,
  "url_type": "profile | post | invite | feature",
  "entity_type": "user | bot | channel | group",
  "privacy": "public | private",
  "username": "@BotFather",
  "invite_code": null,

  "profile": {
    "name": "BotFather",
    "photo": "https://cdn.telegram.org/...",
    "description": "BotFather is the one bot to rule them all.",
    "verified": true,
    "restricted": false,
    "fake": false,
    "scam": false
  },

  "stats": {
    "subscribers": null,
    "members": null,
    "monthly_users": 3544775
  },

  "group": {
    "is_supergroup": false,
    "is_forum": false,
    "topics_enabled": false
  },

  "channel": {
    "discussion_enabled": false
  },

  "post": {
    "post_id": null,
    "comment_id": null,
    "text": null
  },

  "feature": {
    "type": null,
    "value": null
  },

  "raw": {
    "extras": [
      "@BotFather",
      "3 544 775 monthly users"
    ]
  }
}</code></pre>

<hr/>

<h2>🔍 Field Explanation</h2>

<ul>
  <li><b>url_type</b> – Identifies if URL is profile, post, invite, or feature</li>
  <li><b>entity_type</b> – Telegram entity classification</li>
  <li><b>privacy</b> – Public or private (invite-based)</li>
  <li><b>verified</b> – Detected via Telegram verified badge</li>
  <li><b>stats</b> – Subscribers / Members / Monthly users (if visible)</li>
  <li><b>raw.extras</b> – Raw visible metadata from Telegram page</li>
</ul>

<hr/>

<h2>⚠️ Limitations</h2>

<ul>
  <li>❌ Private groups/channels without invite</li>
  <li>❌ Phone numbers</li>
  <li>❌ Members list or admins</li>
  <li>❌ Message history without login</li>
  <li>❌ Secret chats</li>
</ul>

<p>
These limitations exist because Telegram does not expose this data on public web pages.
</p>

<hr/>

<h2>🛡️ Rate Limiting & Reliability</h2>

<ul>
  <li>Telegram may rate-limit excessive requests</li>
  <li>Use caching for high-traffic applications</li>
  <li>Recommended for public metadata only</li>
</ul>

<hr/>

<h2>🧠 Use Cases</h2>

<ul>
  <li>Telegram profile preview</li>
  <li>Bot intelligence & discovery</li>
  <li>Channel analytics</li>
  <li>Group classification</li>
  <li>OSINT / public data analysis</li>
  <li>App integrations (metadata only)</li>
</ul>

<hr/>

<h2>📌 Tech Stack</h2>

<ul>
  <li>Node.js</li>
  <li>Axios</li>
  <li>Cheerio</li>
  <li>Vercel Serverless Functions</li>
</ul>

<hr/>

<h2>⚖️ Disclaimer</h2>

<p>
This project is for <b>educational and informational purposes only</b>.
The author is not affiliated with Telegram.
Use responsibly and respect Telegram’s Terms of Service.
</p>

<hr/>

<h2>⭐ Support</h2>

<p>
If you find this project useful, consider giving it a ⭐ on GitHub.
</p>

<p>
Built with ❤️ for developers.
</p>
