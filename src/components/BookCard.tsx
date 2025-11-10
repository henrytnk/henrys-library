import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{book.author}</p>
          {book.year && (
            <p className="text-xs text-muted-foreground">Published: {book.year}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
