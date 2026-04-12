import '../styles/bookmodal.css'; // Fixed: Nilagyan ng 'import'

function BookModal({ book, isOpen, onClose, onBorrow }) {
  if (!isOpen || !book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Pinipigilan nito magsara ang modal kapag kinlick mo yung mismong loob ng white box */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{book.title}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        {/* Binago natin ang structure dito sa loob ng modal-body */}
        <div className="modal-body">
          {/* Kaliwang bahagi: Maliit na Image */}
          <div className="modal-image-wrapper">
            <img src={book.image} alt={book.title} className="modal-book-cover" />
          </div>

          {/* Kanang bahagi: Mga Detalye */}
          <div className="modal-text-details">
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Category:</strong> {book.category}</p> {/* Dinagdag ko na rin ang category */}
            <p><strong>Description:</strong> Isang magandang libro tungkol sa pakikipagsapalaran at pag-aaral. Basahin para matuto at ma-inspire!</p>
            <p className="available-copies">
              <strong>Available Copies:</strong> <span>{book.copies || 3}</span>
            </p>
          </div>
        </div>

        <button className="borrow-btn" onClick={() => onBorrow(book.id)}>
          Borrow Book
        </button>
      </div>
    </div>
  );
}

export default BookModal;