# 📚 Book Finder App

A simple, responsive **Book Finder** web application built with **React + Vite + Tailwind CSS** that allows users to search for books using the [Open Library Search API](https://openlibrary.org/developers/api).  

The app is designed for **Alex (a college student persona)** who needs a quick and easy way to find books.

---

## 🚀 Features

- 🔎 Search books by title (via Open Library API)  
- 📖 Display results in **responsive book cards** with cover images, authors, and publish year  
- 🎨 Clean UI with **green & white theme** using Tailwind CSS  
- 📱 Fully responsive (works on mobile, tablet, desktop)  
- ⚡ Built with Vite (fast dev server + build)  
- 💾 Extensible for features like favorites, recent searches, filters, authentication, etc.

---


## ⚙️ Workflow

### 1. **App Bootstrapping**
- Project initialized with **Vite + React**  
- Tailwind installed and configured (`tailwind.config.js`, `postcss.config.js`)  

### 2. **Styling**
- `index.css` includes Tailwind’s base, components, and utilities.  
- `App.jsx` and components use **Tailwind utility classes** for responsive design and theming (green + white).  

### 3. **Search Flow**
1. User enters a book title in **SearchBar**.  
2. On submit, frontend calls Open Library API:  

3. Results are transformed into objects `{ title, author, year, coverId, key }`.  
4. Each book is rendered using **BookCard**.  

### 4. **UI States**
- **Loading** → Spinner shown while fetching.  
- **Error** → Error message box shown.  
- **No results** → Graceful fallback message.  
- **Results grid** → Responsive cards with hover effect + Open Library link.  

### 5. **Responsive Layout**
- Mobile: vertical stacking.  
- Tablet/Desktop: grid layout (`grid-cols-2`, `grid-cols-3`).  

---

## 🛠️ Installation & Running Locally   

```bash
# Clone repository
git clone https://github.com/vini8976/BookFinder.git
cd bookfinder

# Install dependencies
npm install

# Start development server
npm run dev

