import fs from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { spawn } from "node:child_process";

const projectRoot = path.resolve(process.cwd());
const templatePath = path.join(projectRoot, "content", "posts", "2026-04-000.md");
const postsDir = path.join(projectRoot, "content", "posts");

const allowedCategories = new Set(["c1", "c2", "c3", "c4"]);

const pad = (value) => String(value).padStart(2, "0");
const formatToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const parseArgs = (argv) => {
  const args = {
    slug: "",
    category: "",
    titleKo: "",
    titleEn: "",
    summaryKo: "",
    summaryEn: "",
    build: true
  };
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];

    if (!token.startsWith("-")) {
      positional.push(token.trim());
      continue;
    }

    if (token.startsWith("--slug=")) {
      args.slug = token.slice("--slug=".length).trim();
      continue;
    }
    if (token === "--slug" && next) {
      args.slug = next.trim();
      i += 1;
      continue;
    }
    if (token.startsWith("--category=")) {
      args.category = token.slice("--category=".length).trim();
      continue;
    }
    if (token === "--category" && next) {
      args.category = next.trim();
      i += 1;
      continue;
    }
    if (token.startsWith("--title-ko=")) {
      args.titleKo = token.slice("--title-ko=".length).trim();
      continue;
    }
    if (token === "--title-ko" && next) {
      args.titleKo = next.trim();
      i += 1;
      continue;
    }
    if (token.startsWith("--title-en=")) {
      args.titleEn = token.slice("--title-en=".length).trim();
      continue;
    }
    if (token === "--title-en" && next) {
      args.titleEn = next.trim();
      i += 1;
      continue;
    }
    if (token.startsWith("--summary-ko=")) {
      args.summaryKo = token.slice("--summary-ko=".length).trim();
      continue;
    }
    if (token === "--summary-ko" && next) {
      args.summaryKo = next.trim();
      i += 1;
      continue;
    }
    if (token.startsWith("--summary-en=")) {
      args.summaryEn = token.slice("--summary-en=".length).trim();
      continue;
    }
    if (token === "--summary-en" && next) {
      args.summaryEn = next.trim();
      i += 1;
      continue;
    }
    if (token === "--no-build") {
      args.build = false;
    }
  }

  if (!args.slug && positional[0]) args.slug = positional[0];
  if (!args.category && positional[1]) args.category = positional[1];

  return args;
};

const askRequiredInput = async (initial) => {
  const rl = createInterface({ input, output });
  const result = { ...initial };

  try {
    while (!result.slug) {
      const value = (await rl.question("slug 입력 (예: 2026-04-005): ")).trim();
      if (value) result.slug = value;
    }

    while (!result.category || !allowedCategories.has(result.category)) {
      const hint = "카테고리 입력 (c1/c2/c3/c4): ";
      const value = (await rl.question(hint)).trim().toLowerCase();
      if (allowedCategories.has(value)) {
        result.category = value;
      } else {
        console.log("유효하지 않은 카테고리입니다.");
      }
    }
  } finally {
    rl.close();
  }

  return result;
};

const validateSlug = (slug) => /^\d{4}-\d{2}-\d{3}$/.test(slug);

const buildMarkdown = (template, values) =>
  template
    .replace(/^slug:\s*.*$/m, `slug: ${values.slug}`)
    .replace(/^date:\s*.*$/m, `date: ${values.date}`)
    .replace(/^category:\s*.*$/m, `category: ${values.category}`)
    .replace(/^published:\s*.*$/m, "published: false")
    .replace(/^title_ko:\s*.*$/m, `title_ko: ${values.titleKo}`)
    .replace(/^title_en:\s*.*$/m, `title_en: ${values.titleEn}`)
    .replace(/^summary_ko:\s*.*$/m, `summary_ko: ${values.summaryKo}`)
    .replace(/^summary_en:\s*.*$/m, `summary_en: ${values.summaryEn}`);

const runBuild = () =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/build-blog.mjs"], {
      cwd: projectRoot,
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`build:blog failed with exit code ${code}`));
    });
  });

const main = async () => {
  const initialArgs = parseArgs(process.argv.slice(2));
  const args = await askRequiredInput(initialArgs);

  if (!validateSlug(args.slug)) {
    throw new Error("slug는 YYYY-MM-XXX(세 자리 숫자) 형식이어야 합니다.");
  }
  if (!allowedCategories.has(args.category)) {
    throw new Error("category는 c1/c2/c3/c4 중 하나여야 합니다.");
  }

  const template = await fs.readFile(templatePath, "utf8");
  const outputPath = path.join(postsDir, `${args.slug}.md`);

  try {
    await fs.access(outputPath);
    throw new Error(`이미 존재하는 포스트입니다: ${path.basename(outputPath)}`);
  } catch (error) {
    if (error && error.code !== "ENOENT") throw error;
  }

  const titleKo = args.titleKo || "임시 한국어 제목 (수정 필요)";
  const titleEn = args.titleEn || "Temporary English Title (Needs Edit)";
  const summaryKo = args.summaryKo || "임시 요약입니다. 게시 전 수정하세요.";
  const summaryEn = args.summaryEn || "Temporary summary. Please edit before publishing.";
  const markdown = buildMarkdown(template, {
    slug: args.slug,
    date: formatToday(),
    category: args.category,
    titleKo,
    titleEn,
    summaryKo,
    summaryEn
  });

  await fs.writeFile(outputPath, markdown, "utf8");
  console.log(`생성 완료: ${path.relative(projectRoot, outputPath)}`);
  console.log("기본값으로 published: false 상태입니다.");

  if (args.build) {
    await runBuild();
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
