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

To run both the API server and the frontend:

```bash
npm run dev:all
```

This will start:
- API server at `http://localhost:3001`
- Frontend at `http://localhost:5174/`

To run them separately:

```bash
# Terminal 1 - API Server
npm run server

# Terminal 2 - Frontend
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

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

### Adding Books
Simply edit `src/data/books.json` to add or modify books in your collection.

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

All changes made in the admin dashboard are **permanently saved** to the `src/data/books.json` file through a simple Express API server. This means:

- ✅ Edits are saved to disk
- ✅ Deletions are persisted
- ✅ New books are permanently added
- ✅ Changes survive page refreshes and server restarts
- ✅ Import/export your entire library

**Note:** The `src/data` folder is gitignored to keep your personal library private.

### API Endpoints

The API server (`server/index.js`) provides:
- `GET /api/books` - Fetch all books
- `POST /api/books` - Save all books to JSON file
- `GET /api/books/export` - Download books as JSON file
