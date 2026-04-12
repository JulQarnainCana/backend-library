import { useState, useCallback, useMemo } from "react";
import "../../styles/pages.css";
import "../../styles/bookmodal.css";

const seed = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    copies: 4,
    status: "Active",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    copies: 2,
    status: "Active",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=200&auto=format&fit=crop",
  },
];

function getNextBookId(list) {
  if (!list.length) return 1;
  return Math.max(...list.map((b) => Number(b.id) || 0)) + 1;
}

function isAllowedImageUrl(url) {
  const t = url.trim().toLowerCase();
  if (!t) return false;
  return /\.(jpe?g|png)(\?|#|$)/i.test(t);
}

function isAllowedImageFile(file) {
  if (!file) return false;
  const name = file.name.toLowerCase();
  const typeOk = file.type === "image/jpeg" || file.type === "image/png";
  const extOk = /\.(jpe?g|png)$/i.test(name);
  return typeOk || extOk;
}

export default function ManageBooks() {
  const [books, setBooks] = useState(seed);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState("1");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");

  const nextBookId = useMemo(() => getNextBookId(books), [books]);

  const resetForm = useCallback(() => {
    setTitle("");
    setAuthor("");
    setCopies("1");
    setImageUrl("");
    setImageFileName("");
    setImageDataUrl("");
  }, []);

  const closeAddModal = () => {
    setAddModalOpen(false);
    setConfirmOpen(false);
    resetForm();
  };

  const openAddModal = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!isAllowedImageFile(file)) {
      alert("Only JPG, JPEG, and PNG images are allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(typeof reader.result === "string" ? reader.result : "");
      setImageFileName(file.name);
      setImageUrl("");
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (v) => {
    setImageUrl(v);
    if (v.trim()) {
      setImageDataUrl("");
      setImageFileName("");
    }
  };

  const validateForm = () => {
    if (!title.trim() || !author.trim()) {
      alert("Please enter title and author.");
      return false;
    }
    const n = Math.max(1, parseInt(copies, 10) || 0);
    if (!Number.isFinite(n) || n < 1) {
      alert("Copies must be at least 1.");
      return false;
    }
    const hasFile = Boolean(imageDataUrl);
    const hasUrl = imageUrl.trim().length > 0;
    if (!hasFile && !hasUrl) {
      alert("Add a cover image using a URL or by uploading a JPG, JPEG, or PNG file.");
      return false;
    }
    if (hasUrl && !isAllowedImageUrl(imageUrl)) {
      alert("Image URL must end with .jpg, .jpeg, or .png");
      return false;
    }
    return true;
  };

  const resolvedImage = imageDataUrl || imageUrl.trim();

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setConfirmOpen(true);
  };

  const handleConfirmAdd = () => {
    const id = getNextBookId(books);
    const n = Math.max(1, parseInt(copies, 10) || 1);
    setBooks((prev) => [
      ...prev,
      {
        id,
        title: title.trim(),
        author: author.trim(),
        copies: n,
        status: "Active",
        image: resolvedImage,
      },
    ]);
    setConfirmOpen(false);
    setAddModalOpen(false);
    resetForm();
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
  };

  const remove = (id) => {
    if (!confirm("Remove this book from the demo list?")) return;
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <>
      <h1>Admin catalog management</h1>
      <p>Add, update, or remove book records.</p>

      <div className="manage-books-toolbar">
        <button type="button" className="btn-primary" onClick={openAddModal}>
          Add New Book
        </button>
      </div>

      {addModalOpen && (
        <div className="modal-overlay" role="presentation" onClick={closeAddModal}>
          <div className="modal-content modal-content--form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Book</h2>
              <button type="button" className="close-btn" onClick={closeAddModal} aria-label="Close">
                &times;
              </button>
            </div>

            <form className="modal-form-stack" onSubmit={handleOpenConfirm}>
              <label>
                Book ID
                <input type="text" readOnly value={String(nextBookId)} />
                <span className="field-hint">Next catalog ID (auto, based on current books).</span>
              </label>

              <label>
                Cover image URL (.jpg, .jpeg, .png)
                <input
                  type="url"
                  placeholder="https://example.com/cover.jpg"
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  disabled={Boolean(imageDataUrl)}
                />
              </label>

              <label>
                Or upload image (JPG, JPEG, PNG only)
                <input type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={handleFileChange} />
                {imageFileName ? <span className="field-hint">Selected: {imageFileName}</span> : null}
              </label>

              {resolvedImage ? (
                <div className="add-book-preview">
                  <img src={resolvedImage} alt="Cover preview" />
                </div>
              ) : null}

              <label>
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </label>

              <label>
                Author
                <input value={author} onChange={(e) => setAuthor(e.target.value)} required />
              </label>

              <label>
                Copies
                <input type="number" min={1} value={copies} onChange={(e) => setCopies(e.target.value)} required />
              </label>

              <div className="modal-actions">
                <button type="button" className="btn-modal-secondary" onClick={closeAddModal}>
                  Cancel
                </button>
                <button type="submit" className="borrow-btn" style={{ marginTop: 0 }}>
                  Add book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div
          className="modal-overlay modal-overlay--confirm"
          role="presentation"
          onClick={handleCancelConfirm}
        >
          <div className="modal-content modal-content--narrow" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm new book</h2>
              <button type="button" className="close-btn" onClick={handleCancelConfirm} aria-label="Close">
                &times;
              </button>
            </div>
            <p className="confirm-summary">Add this book to the catalog?</p>
            <ul className="confirm-details">
              <li>
                <strong>Book ID:</strong> {nextBookId}
              </li>
              <li>
                <strong>Title:</strong> {title.trim()}
              </li>
              <li>
                <strong>Author:</strong> {author.trim()}
              </li>
              <li>
                <strong>Copies:</strong> {Math.max(1, parseInt(copies, 10) || 1)}
              </li>
            </ul>
            {resolvedImage ? (
              <div className="add-book-preview add-book-preview--sm">
                <img src={resolvedImage} alt="" />
              </div>
            ) : null}
            <div className="modal-actions">
              <button type="button" className="btn-modal-secondary" onClick={handleCancelConfirm}>
                Cancel
              </button>
              <button type="button" className="borrow-btn" style={{ marginTop: 0 }} onClick={handleConfirmAdd}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Copies</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>
                  {b.image ? (
                    <img src={b.image} alt="" className="table-book-thumb" />
                  ) : (
                    <span className="field-hint">—</span>
                  )}
                </td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.copies}</td>
                <td>
                  <span className="badge badge-success">{b.status}</span>
                </td>
                <td>
                  <button type="button" className="btn-sm danger" onClick={() => remove(b.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
