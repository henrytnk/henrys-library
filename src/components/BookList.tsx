import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/BookCard";
import type { Book } from "@/types/book";
import { booksApi } from "@/services/api";

export function BookList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const data = await booksApi.getAll();
      setBooks(data);
    } catch (err) {
      console.error("Failed to load books:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = useMemo(() => {
    let filtered = [...books];

    // Apply letter filter
    if (selectedLetter) {
      filtered = filtered.filter((book) =>
        book.title.toUpperCase().startsWith(selectedLetter)
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.year && book.year.toString().includes(query))
      );
    }

    // Sort alphabetically by title
    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [books, searchQuery, selectedLetter]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading books...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Henry's Library</h1>
        <p className="text-muted-foreground">
          A list of all <strong>{books.length}</strong> books in my library.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by title, author, or year..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Alphabet Filter Buttons */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelectedLetter(null)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selectedLetter === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            All
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedLetter === letter
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Found {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBooks.map((book, index) => (
            <BookCard key={`${book.title}-${index}`} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No books found matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
