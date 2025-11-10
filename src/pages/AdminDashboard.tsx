import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, LogOut, Plus, X, Save, Download, Upload } from "lucide-react";
import type { Book } from "@/types/book";
import { booksApi } from "@/services/api";
import type { ChangeEvent } from "react";

export function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Book>({ title: "", author: "", year: null });
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const data = await booksApi.getAll();
      const sortedBooks = [...data].sort((a, b) => a.title.localeCompare(b.title));
      setBooks(sortedBooks);
      setError(null);
    } catch (err) {
      setError("Failed to load books. Make sure the API server is running.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBooks = async (updatedBooks: Book[]) => {
    try {
      await booksApi.saveAll(updatedBooks);
      setBooks(updatedBooks);
      return true;
    } catch (err) {
      setError("Failed to save changes");
      console.error(err);
      return false;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEdit = (index: number) => {
    setEditingId(index);
    setEditForm(books[index]);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (editingId !== null) {
      const updatedBooks = [...books];
      updatedBooks[editingId] = editForm;
      const sortedBooks = updatedBooks.sort((a, b) => a.title.localeCompare(b.title));
      
      const success = await saveBooks(sortedBooks);
      if (success) {
        setEditingId(null);
        alert("Changes saved successfully!");
      }
    }
  };

  const handleDelete = async (index: number) => {
    if (confirm("Are you sure you want to delete this book?")) {
      const updatedBooks = books.filter((_, i) => i !== index);
      const success = await saveBooks(updatedBooks);
      if (success) {
        alert("Book deleted successfully!");
      }
    }
  };

  const handleAdd = async () => {
    if (editForm.title && editForm.author) {
      const updatedBooks = [...books, editForm];
      const sortedBooks = updatedBooks.sort((a, b) => a.title.localeCompare(b.title));
      
      const success = await saveBooks(sortedBooks);
      if (success) {
        setIsAdding(false);
        setEditForm({ title: "", author: "", year: null });
        alert("Book added successfully!");
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm({ title: "", author: "", year: null });
  };

  const handleExport = () => {
    booksApi.exportBooks();
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedBooks = await booksApi.importBooks(file);
      
      // Validate that books have required fields
      const validBooks = importedBooks.filter(
        (book: Book) => book.title && book.author
      );

      if (validBooks.length === 0) {
        alert("No valid books found in the file");
        return;
      }

      if (confirm(`Import ${validBooks.length} books? This will replace your current collection.`)) {
        const sortedBooks = validBooks.sort((a, b) => a.title.localeCompare(b.title));
        const success = await saveBooks(sortedBooks);
        if (success) {
          alert(`Successfully imported ${validBooks.length} books!`);
        }
      }
    } catch (err) {
      alert(`Import failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }

    // Reset file input
    event.target.value = "";
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.year && book.year.toString().includes(searchQuery))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading books...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your book collection</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              View Library
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Import/Export Section */}
        <div className="mb-6 flex gap-2 justify-end">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Library
          </Button>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Import Library
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </Button>
        </div>

        {/* Search and Add */}
        <div className="mb-6 flex gap-4">
          <Input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setEditForm({ title: "", author: "", year: null });
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </div>

        {/* Add New Book Form */}
        {isAdding && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Book</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Book title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <Input
                    value={editForm.author}
                    onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Year</label>
                  <Input
                    type="number"
                    value={editForm.year || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        year: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    placeholder="Publication year"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAdd}>
                  <Save className="mr-2 h-4 w-4" />
                  Add Book
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Books List */}
        <div className="space-y-4">
          {filteredBooks.map((book, index) => {
            const actualIndex = books.findIndex(
              (b) => b.title === book.title && b.author === book.author && b.year === book.year
            );
            const isEditing = editingId === actualIndex;

            return (
              <Card key={`${book.title}-${index}`}>
                <CardContent className="pt-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Title</label>
                          <Input
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({ ...editForm, title: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Author</label>
                          <Input
                            value={editForm.author}
                            onChange={(e) =>
                              setEditForm({ ...editForm, author: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Year</label>
                          <Input
                            type="number"
                            value={editForm.year || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                year: e.target.value ? parseInt(e.target.value) : null,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm">
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={handleCancel} size="sm">
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{book.title}</h3>
                        <p className="text-muted-foreground">{book.author}</p>
                        {book.year && (
                          <p className="text-sm text-muted-foreground mt-1">{book.year}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(actualIndex)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(actualIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books found</p>
          </div>
        )}
      </div>
    </div>
  );
}
