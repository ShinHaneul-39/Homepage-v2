import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const contentDir = path.join(projectRoot, "content", "posts");
const dataDir = path.join(projectRoot, "pages", "data");
const postsDir = path.join(projectRoot, "pages", "posts");
const outputJsonPath = path.join(dataDir, "blog_posts.json");

const i18n = {
  ko: {
    home: "Home",
    career: "Career",
    blog: "Blog",
    contact: "Contact",
    back: "목록으로 돌아가기",
    footer: "© 2022-2026 신하늘, All Rights Reserved."
  },
  en: {
    home: "Home",
    career: "Career",
    blog: "Blog",
    contact: "Contact",
    back: "Back to Blog",
    footer: "© 2022-2026 Shin Haneul, All Rights Reserved."
  }
};

const getCategoryLabel = (category, lang) => {
  const labels = {
    c1: { ko: "디스코드 운영", en: "Discord Ops" },
    c2: { ko: "개발 기록", en: "Dev Log" },
    c3: { ko: "개인 회고", en: "Retrospective" },
    c4: { ko: "공지/업데이트", en: "Notice/Updates" }
  };
  return labels[category]?.[lang] || category;
};

const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const parseFrontMatter = (rawText) => {
  const match = rawText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Front matter is required in each markdown post.");
  }

  const frontMatterText = match[1];
  const body = match[2];
  const frontMatter = {};

  frontMatterText.split(/\r?\n/).forEach((line) => {
    if (!line.trim()) return;
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    frontMatter[key] = value;
  });

  return { frontMatter, body };
};

const splitLocalizedBody = (body) => {
  const koMatch = body.match(/<!--\s*ko\s*-->\s*([\s\S]*?)(?=<!--\s*en\s*-->|$)/i);
  const enMatch = body.match(/<!--\s*en\s*-->\s*([\s\S]*)$/i);
  const ko = koMatch ? koMatch[1].trim() : body.trim();
  const en = enMatch ? enMatch[1].trim() : ko;
  return { ko, en };
};

const markdownToHtml = (markdownText) => {
  const lines = markdownText.split(/\r?\n/);
  const html = [];
  let inCode = false;
  let inList = false;
  let paragraphLines = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    html.push(`<p>${paragraphLines.join("<br />")}</p>`);
    paragraphLines = [];
  };

  const closeList = () => {
    if (!inList) return;
    html.push("</ul>");
    inList = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("```")) {
      flushParagraph();
      closeList();
      if (!inCode) {
        const lang = line.slice(3).trim();
        const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : "";
        html.push(`<pre><code${langClass}>`);
        inCode = true;
      } else {
        html.push("</code></pre>");
        inCode = false;
      }
      continue;
    }

    if (inCode) {
      html.push(`${escapeHtml(line)}\n`);
      continue;
    }

    if (!line) {
      flushParagraph();
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${escapeHtml(heading[2])}</h${level}>`);
      continue;
    }

    const listItem = line.match(/^-\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${escapeHtml(listItem[1])}</li>`);
      continue;
    }

    closeList();
    paragraphLines.push(escapeHtml(line));
  }

  flushParagraph();
  closeList();
  if (inCode) {
    html.push("</code></pre>");
  }

  return html.join("\n");
};

const buildPostHtml = (post) => {
  const koBody = markdownToHtml(post.body.ko);
  const enBody = markdownToHtml(post.body.en);
  const categoryKo = getCategoryLabel(post.category, "ko");
  const categoryEn = getCategoryLabel(post.category, "en");

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(post.title.ko)} | Blog</title>
    <link rel="icon" type="image/x-icon" href="../../favicon.ico" />
    <meta name="description" content="${escapeHtml(post.summary.ko)}" />
    <style>
      :root {
        --bg: #f5fbff;
        --ink: #13212d;
        --ink-soft: #425161;
        --line: #d9ebf8;
        --brand: #87ceeb;
        --brand-strong: #5aaed6;
        --card: rgba(255, 255, 255, 0.8);
        --shadow: 0 12px 40px rgba(20, 67, 102, 0.12);
        --bg-radial-1: #c8ebfb;
        --bg-radial-2: #e7f7ff;
        --header-border: #ffffff8c;
        --header-bg-a: #f6fcffe8;
        --header-bg-b: #f6fcffcc;
        --surface: #ffffff;
        --surface-soft: #ffffffba;
        --chip-active-bg: #e7f6ff;
        --chip-active-line: #9fc9e4;
      }
      html[data-theme="dark"] {
        color-scheme: dark;
        --bg: #0f151b;
        --ink: #e9f2fa;
        --ink-soft: #b5c4d2;
        --line: #2d3d4c;
        --card: rgba(20, 29, 38, 0.82);
        --shadow: 0 16px 38px rgba(0, 0, 0, 0.45);
        --bg-radial-1: #1e3345;
        --bg-radial-2: #233646;
        --header-border: #273748cc;
        --header-bg-a: #111a24ee;
        --header-bg-b: #111a24d8;
        --surface: #1b2733;
        --surface-soft: #203140;
        --chip-active-bg: #223648;
        --chip-active-line: #3f5870;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        font-family: "Noto Sans KR", sans-serif;
        color: var(--ink);
        line-height: 1.6;
        background:
          radial-gradient(circle at 20% -20%, var(--bg-radial-1) 0%, transparent 40%),
          radial-gradient(circle at 90% 0%, var(--bg-radial-2) 0%, transparent 36%),
          var(--bg);
      }
      .grain::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.14;
        background-image: radial-gradient(#a7d0e61a 1px, transparent 1px);
        background-size: 4px 4px;
      }
      .container {
        width: min(1120px, 92%);
        margin: 0 auto;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 20;
        border-bottom: 1px solid var(--header-border);
        background: linear-gradient(180deg, var(--header-bg-a), var(--header-bg-b));
      }
      .topbar {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 0.8rem;
        padding: 14px 0;
      }
      .brand {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 1.15rem;
      }
      .brand-icon {
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 50%;
        border: 1px solid var(--line);
        object-fit: cover;
        background: var(--surface-soft);
      }
      nav,
      .top-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      nav {
        grid-column: 2;
        justify-self: center;
      }
      .top-actions {
        grid-column: 3;
        justify-self: end;
      }
      .chip,
      .lang,
      .theme-toggle {
        border: 1px solid var(--line);
        border-radius: 999px;
        background: var(--surface);
        color: var(--ink);
        padding: 0.42rem 0.74rem;
        font-size: 0.85rem;
        text-decoration: none;
        cursor: pointer;
      }
      .chip.active {
        background: var(--chip-active-bg);
        border-color: var(--chip-active-line);
      }
      .lang.active {
        background: linear-gradient(135deg, var(--brand), #d9f2ff);
        color: #13212d;
      }
      main {
        flex: 1;
        padding: 1rem 0 2rem;
      }
      .hero {
        margin-top: 0.3rem;
        background: var(--card);
        border: 1px solid var(--surface);
        border-radius: 22px;
        box-shadow: var(--shadow);
        padding: 1.2rem;
      }
      .hero-meta {
        margin: 0;
        color: var(--ink-soft);
        font-size: 0.9rem;
      }
      .hero-main h1 {
        margin: 0.35rem 0 0.45rem;
        font-size: clamp(1.8rem, 3.4vw, 2.8rem);
        line-height: 1.1;
      }
      .hero-main p {
        max-width: 62ch;
        color: var(--ink-soft);
      }
      article {
        margin-top: 1rem;
        background: var(--card);
        border: 1px solid var(--surface);
        border-radius: 16px;
        box-shadow: var(--shadow);
        padding: 1.05rem;
      }
      .muted {
        color: var(--ink-soft);
      }
      .lang-content {
        display: none;
        margin-top: 1rem;
      }
      .lang-content.active {
        display: block;
      }
      code {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      pre {
        background: #0f1720;
        color: #eef4fa;
        border-radius: 10px;
        padding: 0.8rem;
        overflow: auto;
      }
      ul {
        padding-left: 1.25rem;
      }
      .back {
        display: inline-block;
        margin-top: 1rem;
        color: var(--ink);
      }
      footer {
        text-align: center;
        padding: 1.4rem 0 2rem;
        color: #5b7488;
      }
      @media (max-width: 900px) {
        .topbar {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        nav {
          width: 100%;
          justify-content: center;
        }
      }
    </style>
  </head>
  <body class="grain">
    <header>
      <div class="container topbar">
        <div class="brand">
          <img class="brand-icon" src="../../profile.png" alt="" aria-hidden="true" />
          <span data-i18n-key="brandTitle">신하늘</span>
        </div>
        <nav>
          <a class="chip" data-nav="home" href="../index.html">${i18n.ko.home}</a>
          <a class="chip" data-nav="career" href="../career.html">${i18n.ko.career}</a>
          <a class="chip active" data-nav="blog" href="../blog.html">${i18n.ko.blog}</a>
          <a class="chip" data-nav="contact" href="../contact.html">${i18n.ko.contact}</a>
        </nav>
        <div class="top-actions">
          <button class="theme-toggle" type="button" data-theme-toggle>Dark</button>
          <button class="lang active" data-lang="ko">KO</button>
          <button class="lang" data-lang="en">EN</button>
        </div>
      </div>
    </header>
    <main class="container">
      <section class="hero">
        <div class="hero-main">
          <p class="hero-meta">${escapeHtml(post.date)} · <span data-category-ko="${escapeHtml(categoryKo)}" data-category-en="${escapeHtml(categoryEn)}">${escapeHtml(categoryKo)}</span></p>
          <h1 data-title-ko="${escapeHtml(post.title.ko)}" data-title-en="${escapeHtml(post.title.en)}">${escapeHtml(post.title.ko)}</h1>
          <p class="muted" data-summary-ko="${escapeHtml(post.summary.ko)}" data-summary-en="${escapeHtml(post.summary.en)}">${escapeHtml(post.summary.ko)}</p>
        </div>
      </section>
      <article>
        <section class="lang-content active" data-content="ko">
${koBody}
        </section>
        <section class="lang-content" data-content="en">
${enBody}
        </section>
        <a class="back" href="../blog.html?lang=ko" data-back-ko="${i18n.ko.back}" data-back-en="${i18n.en.back}">${i18n.ko.back}</a>
      </article>
    </main>
    <footer data-footer-ko="${i18n.ko.footer}" data-footer-en="${i18n.en.footer}">${i18n.ko.footer}</footer>
    <script>
      const uiPack = {
        ko: {
          brandTitle: "신하늘",
          home: "Home",
          career: "Career",
          blog: "Blog",
          contact: "Contact",
          back: "${i18n.ko.back}",
          footer: "${i18n.ko.footer}"
        },
        en: {
          brandTitle: "Shin Haneul",
          home: "Home",
          career: "Career",
          blog: "Blog",
          contact: "Contact",
          back: "${i18n.en.back}",
          footer: "${i18n.en.footer}"
        }
      };
      const themeToggleButton = document.querySelector("[data-theme-toggle]");
      const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
      const params = new URLSearchParams(window.location.search);
      const storedLang = localStorage.getItem("preferredLang");
      const initialLang = ["ko", "en"].includes(params.get("lang")) ? params.get("lang") : (["ko", "en"].includes(storedLang) ? storedLang : "ko");

      const getResolvedTheme = () => {
        const explicit = document.documentElement.dataset.theme;
        if (explicit === "dark" || explicit === "light") return explicit;
        return darkMedia.matches ? "dark" : "light";
      };

      const syncThemeToggle = () => {
        if (!themeToggleButton) return;
        themeToggleButton.textContent = getResolvedTheme() === "dark" ? "Light" : "Dark";
      };

      const setLang = (lang) => {
        const t = uiPack[lang] || uiPack.ko;
        const navPathMap = {
          home: "index.html",
          career: "career.html",
          blog: "blog.html",
          contact: "contact.html"
        };
        document.documentElement.lang = lang;
        localStorage.setItem("preferredLang", lang);
        document.querySelectorAll("[data-i18n-key]").forEach((element) => {
          const key = element.dataset.i18nKey;
          if (t[key]) element.textContent = t[key];
        });
        document.querySelectorAll("[data-nav]").forEach((link) => {
          const page = link.dataset.nav;
          if (t[page]) link.textContent = t[page];
          const target = navPathMap[page] || "index.html";
          link.href = "../" + target + "?lang=" + lang;
        });
        document.querySelectorAll(".lang").forEach((button) => button.classList.toggle("active", button.dataset.lang === lang));
        document.querySelectorAll(".lang-content").forEach((section) => section.classList.toggle("active", section.dataset.content === lang));
        const category = document.querySelector("[data-category-ko]");
        const title = document.querySelector("[data-title-ko]");
        const summary = document.querySelector("[data-summary-ko]");
        const back = document.querySelector(".back");
        const footer = document.querySelector("footer");
        category.textContent = lang === "en" ? category.dataset.categoryEn : category.dataset.categoryKo;
        title.textContent = lang === "en" ? title.dataset.titleEn : title.dataset.titleKo;
        summary.textContent = lang === "en" ? summary.dataset.summaryEn : summary.dataset.summaryKo;
        back.textContent = t.back;
        back.href = "../blog.html?lang=" + lang;
        footer.textContent = t.footer;
      };

      document.querySelectorAll(".lang").forEach((button) => {
        button.addEventListener("click", () => setLang(button.dataset.lang));
      });
      if (themeToggleButton) {
        themeToggleButton.addEventListener("click", () => {
          const currentTheme = getResolvedTheme();
          document.documentElement.dataset.theme = currentTheme === "dark" ? "light" : "dark";
          syncThemeToggle();
        });
      }
      if (darkMedia.addEventListener) {
        darkMedia.addEventListener("change", () => {
          if (!document.documentElement.dataset.theme) syncThemeToggle();
        });
      }
      syncThemeToggle();
      setLang(initialLang);
    </script>
  </body>
</html>`;
};

const toBoolean = (value, defaultValue = true) => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() !== "false";
};

const requiredFields = [
  "slug",
  "date",
  "category",
  "title_ko",
  "title_en",
  "summary_ko",
  "summary_en"
];

const readPosts = async () => {
  const fileNames = (await fs.readdir(contentDir)).filter((fileName) => fileName.endsWith(".md"));
  const posts = [];

  for (const fileName of fileNames) {
    const fullPath = path.join(contentDir, fileName);
    const rawText = await fs.readFile(fullPath, "utf8");
    const { frontMatter, body } = parseFrontMatter(rawText);
    const missing = requiredFields.filter((field) => !frontMatter[field]);
    if (missing.length > 0) {
      throw new Error(`${fileName} has missing required fields: ${missing.join(", ")}`);
    }
    if (!toBoolean(frontMatter.published, true)) continue;

    const localizedBody = splitLocalizedBody(body);
    posts.push({
      slug: frontMatter.slug,
      date: frontMatter.date,
      category: frontMatter.category,
      title: { ko: frontMatter.title_ko, en: frontMatter.title_en },
      summary: { ko: frontMatter.summary_ko, en: frontMatter.summary_en },
      body: localizedBody
    });
  }

  return posts.sort((a, b) => String(b.date).localeCompare(String(a.date)));
};

const writeOutput = async (posts) => {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(postsDir, { recursive: true });

  const postList = posts.map((post) => ({
    slug: post.slug,
    date: post.date,
    category: post.category,
    title: post.title,
    summary: post.summary,
    url: `./posts/${post.slug}.html`
  }));

  await fs.writeFile(outputJsonPath, `${JSON.stringify(postList, null, 2)}\n`, "utf8");

  await Promise.all(
    posts.map(async (post) => {
      const outputPath = path.join(postsDir, `${post.slug}.html`);
      await fs.writeFile(outputPath, buildPostHtml(post), "utf8");
    })
  );
};

const main = async () => {
  const posts = await readPosts();
  await writeOutput(posts);
  console.log(`Built blog outputs: ${posts.length} posts`);
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
