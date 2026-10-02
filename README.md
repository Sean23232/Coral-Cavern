# Coral Cavern — Premium Marine Aquarium & Reef Storefront

A modern, high-end marine aquarium and reef boutique web application built with Next.js (App Router), React, and Tailwind CSS, featuring local typography, real reef photography, and catalog products from Coral Cavern.

## Deploying to Vercel (via GitHub)

This application is configured for zero-configuration deployment on Vercel:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Coral Cavern redesign"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```
2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your GitHub repository.
   - Framework preset will automatically be **Next.js**.
   - **No environment variables are required** to view and test the complete design, catalog, and photos. The storefront automatically uses the bundled catalog and assets.
   - Click **Deploy**.

## Assets & Images

All images and fonts are included directly in the repository inside `public/`:
- `public/images/`: Hero, aquarium, and collection photography.
- `public/images/products/`: Verified specimen images for corals, inverts, and marine life.
- `public/fonts/`: DM Sans and DM Serif Display font files.

## Features

- **Homepage**: Announcement bar, navigation, cinematic hero, featured categories, "Explore Our Reef" product grid, "Life in All Its Color" marine life section, "Why Coral Cavern" trust blocks, services spotlight, educational guides, and newsletter.
- **Shop & Categories**: Dedicated pages for Corals, Saltwater Fish, Invertebrates, and Supplies with filtering, sorting, and responsive grids.
- **Product Details**: Image gallery with zoom and crop modes, specimen details, care specifications (lighting, flow, difficulty), add to cart, and related items.
- **Shopping Cart & Wishlist**: Persistent client-side cart drawer, full cart page, quantity controls, and saved favorites.
- **Checkout**: Two-step checkout with delivery and local pickup options, merchandise summaries, and reloadable order confirmation.
- **Services & Story**: Dedicated aquarium installation and maintenance pages with consultation request forms, brand story, FAQ, and store policies.
- **Search**: Global search by name, species, category, and keyword with responsive overlays.
- **Database Support**: Built-in support for PostgreSQL via Drizzle ORM when `DATABASE_URL` is configured, with automatic graceful fallback to the bundled catalog when deploying without a database.
