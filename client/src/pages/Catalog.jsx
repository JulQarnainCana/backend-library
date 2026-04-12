import { useState } from "react";
import BookModal from "../components/BookModal";
import "../styles/Catalog.css";

function Catalog() {
  // Dinagdagan natin ng 'category' ang bawat libro at nagdagdag ng iilang dummy data
  const [books] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop" },
    { id: 2, title: "1984", author: "George Orwell", category: "Dystopian", image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=400&auto=format&fit=crop" },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Classic", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop" },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", category: "Romance", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop" },
    { id: 5, title: "Moby Dick", author: "Herman Melville", category: "Adventure", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop" },
    { id: 6, title: "Brave New World", author: "Aldous Huxley", category: "Dystopian", image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=400&auto=format&fit=crop" },
  ]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- BAGONG STATES PARA SA FEATURES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Listahan ng mga categories (kinukuha dynamically mula sa books + "All")
  const categories = ["All", ...new Set(books.map(book => book.category))];

  // Logic para i-filter ang mga libro base sa search at category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleBorrow = (bookId) => {
    alert(`Successfully borrowed book ID: ${bookId}`);
    handleCloseModal();
  };

  return (
    <>
      <h1>Catalog</h1>
      <p>Browse our collection of books.</p>

      <div className="catalog-controls">
        <input
          type="text"
          placeholder="Search by title or author..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => handleOpenModal(book)}
              onKeyDown={(e) => e.key === "Enter" && handleOpenModal(book)}
              role="button"
              tabIndex={0}
            >
              <img src={book.image} alt={book.title} className="book-cover" />
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No books found matching your criteria.</p>
        )}
      </div>

      <BookModal book={selectedBook} isOpen={isModalOpen} onClose={handleCloseModal} onBorrow={handleBorrow} />
    </>
  );
}

export default Catalog;