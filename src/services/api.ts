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
};
