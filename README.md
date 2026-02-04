# WebSavvys V2

One-page company website built with Laravel, Vue 3 (Composition API), Vite, SCSS, and i18n (EN/KA). Includes light/dark themes, responsive layout, and modular section components.

**Tech Stack**
- Laravel
- Vue 3 + Vite
- SCSS
- Vue I18n
- Font Awesome

**Features**
- Single-page layout (no routing)
- Theme switcher (light/dark)
- Language switcher (EN/KA)
- Responsive layout with mobile menu
- Smooth transitions and animations
- Modular Vue section components

**Getting Started**
1. Install PHP dependencies
```
composer install
```
2. Install Node dependencies
```
npm install
```
3. Create environment file
```
cp .env.example .env
php artisan key:generate
```
4. Run the app
```
npm run dev
php artisan serve
```

**Scripts**
- `npm run dev` Start Vite dev server
- `npm run build` Build assets
- `npm run lint` Lint and fix
- `npm run format` Format resources

**Project Structure**
- `resources/js/App.vue` Main app shell
- `resources/js/components/layout/` Header, footer, chat button
- `resources/js/components/sections/` Page sections
- `resources/js/i18n/` Translation files
- `resources/scss/app.scss` Main styles

**Customization**
- Update text in `resources/js/i18n/en.json` and `resources/js/i18n/ka.json`
- Update theme and layout in `resources/scss/app.scss`
- Update navigation and layout components in `resources/js/components/layout/`

**License**
Private project. All rights reserved.
