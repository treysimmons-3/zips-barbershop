# Zips Barbershop

A static HTML, CSS, and JavaScript website. Vite is used only to preview and create the deployable static files; the published site has no React runtime, database, or custom server.

## Update before launch

- Replace the demo name, barber bios, hours, address, phone, email, Instagram, and `YOUR_DOMAIN_HERE` SEO-domain placeholders in `index.html` and `public/sitemap.xml`.
- Replace `BARBER_1_GOOGLE_BOOKING_URL`, `BARBER_2_GOOGLE_BOOKING_URL`, `GOOGLE_MAPS_URL`, and `FORMSPREE_ENDPOINT` at the top of `script.js`.
- Replace `zane-hero.jpg` in `public/assets/` to update the hero photo, or replace the two Zips logo files to update the branded marks used across the page.

The booking buttons explain when their calendar links have not been configured. The form reports that its endpoint is missing instead of showing a false success message.

## Build and host on GitHub Pages

From the workspace root, run:

```sh
pnpm --filter @workspace/barbershop-site run build
```

Publish the contents of `artifacts/barbershop-site/dist/public/` as the GitHub Pages site. Asset paths are relative, so the build works at a custom domain or a repository subpath.