import type { Book } from "@/types/book";
import booksData from "@/data/books.json";

const STORAGE_KEY = "henrys-library-books";

export const booksApi = {
  async getAll(): Promise<Book[]> {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // If parsing fails, fall back to default
      }
    }
    // Return default books from JSON file
    return booksData as Book[];
  },

  async saveAll(books: Book[]): Promise<void> {
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  },

  exportBooks(books: Book[]): void {
    const dataStr = JSON.stringify(books, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "books-export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async importBooks(file: File): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const books = JSON.parse(content);
          if (!Array.isArray(books)) {
            reject(new Error("Invalid file format: must be a JSON array"));
            return;
          }
          resolve(books);
        } catch {
          reject(new Error("Failed to parse JSON file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  },
};
