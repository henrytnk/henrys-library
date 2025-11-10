# Henry's Library

A modern, elegant web application to display and search through my personal book collection.

## Features

- 📚 Display all books from your reading list
- 🔍 Real-time search functionality (search by title, author, or year)
- 🔤 A-Z alphabet filtering
- 🎨 Clean and modern UI using shadcn/ui components
- 📱 Responsive grid layout
- ⚡ Fast and lightweight with React + Vite
- 🔐 Admin dashboard with authentication
- ✏️ Add, edit, and delete books
- 📥 Import books from JSON file
- 📤 Export your library to JSON file

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

## Project Structure

```
henrys-library/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   ├── BookCard.tsx  # Individual book display
│   │   └── BookList.tsx  # Main component with search
│   ├── data/
│   │   └── books.json    # Book collection data
│   ├── lib/
│   │   └── utils.ts      # Utility functions
│   ├── types/
│   │   └── book.ts       # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## Getting Started

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your admin credentials:
```properties
VITE_ADMIN_USER=your_username
VITE_ADMIN_PASSWORD=your_password
```

### Development

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5174/`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment on Netlify

This app is ready to deploy on Netlify:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set environment variables in Netlify dashboard:
   - `VITE_ADMIN_USER` - Your admin username
   - `VITE_ADMIN_PASSWORD` - Your admin password
4. Deploy!

Build settings:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

The `netlify.toml` file is already configured for proper routing.

## Features in Detail

### Search
The search functionality filters books in real-time as you type, searching across:
- Book titles
- Authors
- Publication years

### Book Display
Each book is displayed in a card showing:
- Title
- Author
- Publication year (when available)

The cards have a subtle hover effect for better interactivity.

## Customization

### Adding Books (Pre-deployment)
Edit `src/data/books.json` to set your initial book collection before deployment.

### Styling
- Tailwind CSS classes can be modified in components
- Theme colors are defined in `src/index.css` using CSS variables
- Dark mode support is available through Tailwind's dark mode feature

## Admin Dashboard

Access the admin dashboard at `/admin` or `/login`.

**Default credentials:**
- Username: `henry` (or as set in `.env`)
- Password: `mylib` (or as set in `.env`)

### Admin Features

- **Add Books** - Add new books to your collection
- **Edit Books** - Update title, author, or publication year
- **Delete Books** - Remove books from your library
- **Import Library** - Upload a JSON file to import books
- **Export Library** - Download your entire collection as a JSON file
- **Search** - Quick search to find specific books

### Import/Export Format

Books should be in JSON array format:
```json
[
  {
    "title": "Book Title",
    "author": "Author Name",
    "year": 2024
  }
]
```

## Data Persistence

All changes made in the admin dashboard are **stored in your browser's localStorage**. This means:

- ✅ Edits persist across page refreshes
- ✅ Changes are saved locally on your device
- ✅ Each browser/device has its own collection
- ✅ Use Import/Export to sync between devices
- ⚠️ Clearing browser data will reset to the default `books.json`

**Initial Data:** The app loads books from `src/data/books.json` on first visit. After that, it uses localStorage for all changes.

**Syncing Between Devices:**
1. Export your library from one device
2. Import the JSON file on another device
