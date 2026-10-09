# Devarpana Tribedi · Portfolio

Personal portfolio website, live at **https://devarpana.github.io/portfolio/**.

Plain HTML, CSS and JavaScript with no build step, hosted for free on GitHub Pages.

## Features

- Dark and light themes, remembered between visits
- Sticky navigation that highlights the current section, with a mobile menu
- Animated coding background, typewriter hero, scroll-reveal animations and a reading progress bar
- Experience timeline (TIH-IITG internship, education, certifications)
- Filterable skills and projects
- Contact form that emails messages through FormSubmit (free), with validation and spam protection
- One-click copy for email addresses
- Social preview image, SEO metadata and a custom 404 page
- Respects the "reduce motion" accessibility setting

## Project structure

```
index.html      Page content
style.css       All styles (colors live in the :root and [data-theme="light"] blocks)
script.js       Interactivity
404.html        "Page not found" page
images/         Screenshots, illustration, favicon and social preview
assets/         CV (PDF)
```

## Editing

- **Add a project:** copy one `<article class="project-card">` block in `index.html`, change the image, text and link, and set `data-cat` to `website`, `ml` or `game` (several allowed, separated by spaces) so the filter picks it up. Add `data-live` if it has a live link.
- **Add a skill:** copy an `<a class="skill">` line and set `data-cat` to `web`, `db`, `lang`, `ds` or `ml`. The counters update themselves.
- **Change the typewriter words:** edit the `roles` list near the top of `script.js`.
- **Change colors:** edit `--accent`, `--accent-2` and `--accent-3` in `style.css`.

## Contact form

Messages are sent by [FormSubmit](https://formsubmit.co) to `devarpanatribedi@gmail.com` (change `formEndpoint` in `script.js` to use another address). The first message ever sent triggers an activation email from FormSubmit; click **Activate Form** once and every later message arrives in the inbox.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploying (free)

GitHub Pages publishes the `main` branch automatically. Merge changes into `main` and the live site updates within a minute or two. No paid hosting is needed.
