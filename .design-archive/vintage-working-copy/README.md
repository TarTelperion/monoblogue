# The Monoblogue — Vintage Fork

A more archival, letterpress-inspired treatment of the playful literary digital garden. This fork preserves the original content model and functionality while exploring aged paper, catalogue cards, typewritten labels, double rules, and restrained oxblood, forest, and brass accents.

Requires Node.js 22.17 or newer; Node 24 is recommended (see `.nvmrc`).

## Local setup

```sh
npm install
cp .env.example .env
npm run dev
```

Before a production build:

```sh
npm run validate:content
npm run check
npm test
npm run build
```

## Writing from Obsidian

Open the `content` directory as an Obsidian vault, or copy `content/templates/Post.md` into an existing vault's template folder. Published entries belong in `content/posts`.

Required frontmatter:

- `title`, `slug`, `summary`, and `published`
- `status`: `draft` or `published`
- `section`: `library`, `programming`, or `language`
- `categories`: slugs from `content/categories.json`
- `languages`: slugs from `content/languages.json`
- `featured`: whether the item appears on Home
- `featuredOrder`: lower numbers appear first
- `void.weight`: bubble size from 1–5
- `void.accent`: `rose`, `green`, `gold`, or `ink`

Programming entries are intentionally excluded from Home and the Library. Every published entry appears in The Void.

Run `npm run validate:content` before committing. It catches missing metadata, duplicate slugs, and unknown categories or languages.

## Subscriber database

SQLite is created at `.data/monoblogue.db` by default. The application enables WAL mode, foreign keys, and a five-second busy timeout. Set `DATABASE_PATH` to use another persistent location.

The subscription flow stores pending subscribers, topic preferences, confirmation tokens, and email delivery events. Without Gmail environment variables, requests are recorded but confirmation delivery remains pending. This lets the UI and database be developed without live credentials.

## Gmail setup

The Gmail adapter needs a Google OAuth client authorized with the narrow `gmail.send` scope. Configure `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, and `GMAIL_SENDER` only in the deployment environment. Never commit them.

`TOKEN_SECRET` must be a long random value in production. It signs unsubscribe links used by future newsletter dispatch tooling.

## Deployment notes

The Node adapter produces a standalone server in `build`. SQLite needs persistent local disk, making a small Lightsail or EC2 instance a better initial AWS target than an ephemeral serverless function. Back up the database file to S3 using SQLite's online backup mechanism or a streaming backup tool.

The current version is intentionally deployment-ready but not deployed. Set `PUBLIC_SITE_URL` to the eventual canonical HTTPS origin before launch.
