import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import { Modal } from "bootstrap";

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    status: "",
    cover: null,
  });
  const [editBook, setEditBook] = useState(null);
const [bookToDelete, setBookToDelete] = useState(null);
const [searchQuery, setSearchQuery] = useState("");



  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await axios.get("http://localhost:5000/books");
    setBooks(res.data);
  };

  const handleAddBook = async () => {
    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("genre", newBook.genre);
    formData.append("status", newBook.status);
    formData.append("cover", newBook.cover);

    try {
      await axios.post("http://localhost:5000/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchBooks();
      const modalElement = document.getElementById("addBookModal");
     const modalInstance = Modal.getOrCreateInstance(modalElement);
      modalInstance.hide();
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  const handleEditClick = (book) => {
    setEditBook({ ...book });
  };

  const handleEditBook = async () => {
    const formData = new FormData();
    formData.append("title", editBook.title);
    formData.append("author", editBook.author);
    formData.append("genre", editBook.genre);
    formData.append("status", editBook.status);
    if (editBook.cover && typeof editBook.cover !== "string") {
      formData.append("cover", editBook.cover);
    }

    try {
      await axios.put(`http://localhost:5000/books/${editBook.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchBooks();
      const modalElement = document.getElementById("editBookModal");
      const modalInstance = Modal.getOrCreateInstance(modalElement); 

      modalInstance.hide();
    } catch (err) {
      console.error("Error editing book:", err);
    }
  };

  const handleShowDeleteModal = (bookId) => {
  setBookToDelete(bookId);
  const modalElement = document.getElementById("deleteConfirmModal");
  const modalInstance = Modal.getOrCreateInstance(modalElement);
  modalInstance.show();
};

const handleDeleteBook = async () => {
  try {
    await axios.delete(`http://localhost:5000/books/${bookToDelete}`);
    fetchBooks();
    const modalElement = document.getElementById("deleteConfirmModal");
    const modalInstance = Modal.getInstance(modalElement);
    modalInstance.hide();
  } catch (err) {
    console.error("Error deleting book:", err);
  }
};

const filteredBooks = books.filter((book) =>
  book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  book.author.toLowerCase().includes(searchQuery.toLowerCase())
);




  return (
  
    <>
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>📚 Book Tracker</Navbar.Brand>
      </Container>
       </Navbar>

      

   
     <Container className="my-4">
  <Row className="align-items-center mb-4">
    <Col md={8}>
      <Form.Control
        type="text"
        placeholder="Search by title or author"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </Col>
    <Col md={4} className="text-end">
      <Button data-bs-toggle="modal" data-bs-target="#addBookModal">
        + Add Book
      </Button>
    </Col>
  </Row>


      
      <Row>
        {filteredBooks.map((book) => (
          <Col md={4} className="mb-4" key={book.id}>
            <Card>
              {book.cover && (
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000${book.cover}`}
                  style={{ height: "300px", objectFit: "contain", backgroundColor: "#f8f9fa" }}
                />
              )}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Text>
                  <strong>Author:</strong> {book.author}
                  <br />
                  <strong>Genre:</strong> {book.genre}
                  <br />
                  <strong>Status:</strong> {book.status}
                </Card.Text>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleEditClick(book)}
                  data-bs-toggle="modal"
                  data-bs-target="#editBookModal"
                >
                  Edit
                </Button>

                <Button
                 variant="outline-danger"
                       size="sm"
                       className="ms-2"
                       onClick={() => handleShowDeleteModal(book.id)}
                  >
                  Delete
                 </Button>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Book Modal */}
      <div
        className="modal fade"
        id="addBookModal"
        tabIndex="-1"
        aria-labelledby="addBookModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addBookModalLabel">
                Add Book
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newBook.title}
                    onChange={(e) =>
                      setNewBook({ ...newBook, title: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    value={newBook.author}
                    onChange={(e) =>
                      setNewBook({ ...newBook, author: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Genre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Fiction, Biography"
                    value={newBook.genre}
                    onChange={(e) =>
                      setNewBook({ ...newBook, genre: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={newBook.status}
                    onChange={(e) =>
                      setNewBook({ ...newBook, status: e.target.value })
                    }
                  >
                    <option value="">Select status</option>
                    <option value="Read">Read</option>
                    <option value="Reading">Reading</option>
                    <option value="To Read">To Read</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Cover</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewBook({ ...newBook, cover: e.target.files[0] })
                    }
                  />
                </Form.Group>
              </Form>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" data-bs-dismiss="modal">
                Close
              </Button>
              <Button variant="primary" onClick={handleAddBook}>
                Save Book
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Book Modal */}
      <div
        className="modal fade"
        id="editBookModal"
        tabIndex="-1"
        aria-labelledby="editBookModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editBookModalLabel">
                Edit Book
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {editBook && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={editBook.title}
                      onChange={(e) =>
                        setEditBook({ ...editBook, title: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                      type="text"
                      value={editBook.author}
                      onChange={(e) =>
                        setEditBook({ ...editBook, author: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Genre</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Fiction, Biography"
                      value={editBook.genre}
                      onChange={(e) =>
                        setEditBook({ ...editBook, genre: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={editBook.status}
                      onChange={(e) =>
                        setEditBook({ ...editBook, status: e.target.value })
                      }
                    >
                      <option value="">Select status</option>
                      <option value="Read">Read</option>
                      <option value="Reading">Reading</option>
                      <option value="To Read">To Read</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Change Cover (optional)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditBook({
                          ...editBook,
                          cover: e.target.files[0],
                        })
                      }
                    />
                  </Form.Group>
                </Form>
              )}
            </div>
            <div className="modal-footer">
              <Button variant="secondary" data-bs-dismiss="modal">
                Close
              </Button>
              <Button variant="primary" onClick={handleEditBook}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

                            {/* Delete Confirmation Modal */}
                               <div
                             className="modal fade"
                            id="deleteConfirmModal"
                             tabIndex="-1"
                          aria-labelledby="deleteConfirmModalLabel"
                      aria-hidden="true"
                        >
                       <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="deleteConfirmModalLabel">Confirm Delete</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                 <div className="modal-body">
                   Are you sure you want to delete this book?
                 </div>
                <div className="modal-footer">
                 <Button variant="secondary" data-bs-dismiss="modal">Cancel</Button>
                      <Button variant="danger" onClick={handleDeleteBook}>Delete</Button>
              </div>
              </div>
            </div>
        </div>

    </Container>
    </>
  );
}

export default App;
