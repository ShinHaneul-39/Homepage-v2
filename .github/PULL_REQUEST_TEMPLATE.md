## Blog Post 자동 생성

- [ ] 이 PR로 블로그 포스트를 생성합니다.

아래 메타데이터를 채우면 GitHub Actions가 자동으로 다음을 수행합니다.
- slug 자동 생성(비워두면 자동)
- `content/posts/*.md` 생성
- `pages/posts/*.html`, `pages/data/blog_posts.json` 재생성
- 결과물을 이 PR 브랜치에 자동 커밋

### 메타데이터(필수)

category: c2
title_ko: 
title_en: 

### 메타데이터(선택)

summary_ko: 
summary_en: 
slug: 
build: true
