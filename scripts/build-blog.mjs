import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const contentDir = path.join(projectRoot, "content", "posts");
const dataDir = path.join(projectRoot, "data");
const postsDir = path.join(projectRoot, "posts");
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

import { marked } from "marked";

const splitLocalizedBody = (body) => {
  const koMatch = body.match(/<!--\s*ko\s*-->\s*([\s\S]*?)(?=<!--\s*en\s*-->|$)/i);
  const enMatch = body.match(/<!--\s*en\s*-->\s*([\s\S]*)$/i);
  const ko = koMatch ? koMatch[1].trim() : body.trim();
  const en = enMatch ? enMatch[1].trim() : ko;
  return { ko, en };
};

const markdownToHtml = (markdownText) => {
  return marked.parse(markdownText);
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
    <link rel="icon" type="image/x-icon" href="../favicon.ico" />
    <meta name="description" content="${escapeHtml(post.summary.ko)}" />
    <link rel="stylesheet" href="../assets/css/global.css" />
    <style>
      
      
      
      
      
      
      
      
      
      
      
      
      
      
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
          <img class="brand-icon" src="../profile.png" alt="" aria-hidden="true" />
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
      setLang(getInitialLang());
    </script>
    <script src="../assets/js/global.js"></script>
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
