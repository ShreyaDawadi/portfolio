# Shreya Dawadi — Portfolio

Personal portfolio built with plain **HTML, CSS and JavaScript**. No frameworks,
no build step, nothing to install.

A single page: hero, about, skills, projects, education, experience and contact.

## Files

```
index.html                  all the page content and SEO tags
css/style.css               all styles: colours, fonts, layout, animations
js/main.js                  theme toggle, menu, project filter, contact form, animations
portrait.jpg                hero photo
Shreya_Dawadi_Resume.pdf    the "Download CV" file
favicon.svg, og.png         browser icon and link-share preview image
sitemap.xml, robots.txt     for search engines
CNAME                       custom domain for GitHub Pages
```

## Run it locally

Open `index.html` in a browser. That's it.

(For the smoothest experience, e.g. so the CV download works the same as online,
you can serve the folder: `npx serve .` or `python -m http.server`, then open
the address it prints.)

## Editing the content

All text lives in `index.html`. Each section is marked with a comment such as
`<!-- ── § 03 Work ── -->`, so you can find it quickly.

- **Projects**: each project is one `<li class="project" data-category="…">` block.
  Copy one to add a project, delete one to remove it, move it to reorder.
  The filter buttons are built automatically from the `data-category` values.
  Give each project's detail panel a unique `id` and point the buttons'
  `aria-controls` at it.
- **Screenshots**: replace a project's `<svg class="plate">…</svg>` with
  `<img src="projects/name.webp" alt="…">` (put the image in a `projects/` folder).
- **Live demo / repo links**: replace the "GitHub profile" link in a project
  with its repository URL, and add a "Live demo" link (there's a commented
  example inside Pokhara Local).
- **Skills**: the small superscript numbers count how many projects use each
  skill, and ◆ marks skills used during the internship. Update them by hand
  when projects change.
- **Resume**: replace `Shreya_Dawadi_Resume.pdf`, keeping the same name.
- **Colours**: the CSS variables at the top of `css/style.css` (one set for
  light, one for dark).
- **Fonts**: loaded from Google Fonts in the `<head>` of `index.html`; the
  font names are set at the top of `css/style.css`.

### Contact form

By default the form validates the message and then opens the visitor's own email
app with everything filled in. To have messages delivered directly instead:

1. Create a free form at [formspree.io](https://formspree.io) using your email address.
2. Copy its endpoint, which looks like `https://formspree.io/f/abcdwxyz`.
3. Paste it into `FORM_ENDPOINT` at the top of `js/main.js` (as a string, in quotes).

### Changing the domain

The address `https://www.shreyadawadi.com.np` appears in `index.html` (canonical
link, Open Graph tags, structured data), `sitemap.xml`, `robots.txt` and `CNAME`.
Update all of them if the domain changes.

## Deploying

The site is deployed to GitHub Pages by `.github/workflows/deploy.yml` on every
push to `main`. It just copies the site files; there is no build.

If you add a new top-level file or folder the site needs (for example a
`projects/` folder of screenshots), add it to the `cp` line in that workflow.

The same folder also works as-is on Netlify (`netlify.toml`) or Vercel
(`vercel.json`), or any other static host: upload the files and you're done.

## Updating the site later

```bash
git add .
git commit -m "Add new project"
git push
```

GitHub Pages republishes automatically, usually within a minute.
