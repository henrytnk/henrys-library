import type { Book } from "@/types/book";

const API_URL = "http://localhost:3001/api";

export const booksApi = {
  async getAll(): Promise<Book[]> {
    const response = await fetch(`${API_URL}/books`);
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    return response.json();
  },

  async saveAll(books: Book[]): Promise<void> {
    const response = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(books),
    });
    if (!response.ok) {
      throw new Error("Failed to save books");
    }
  },

  exportBooks(): void {
    window.open(`${API_URL}/books/export`, '_blank');
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
        } catch (error) {
          reject(new Error("Failed to parse JSON file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  },
};
