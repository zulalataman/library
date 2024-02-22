package com.library.library.service;

import com.library.library.model.Book;
import com.library.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;

    @Autowired
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book addBooks(Book book) {
        return bookRepository.save(book);
    }

    public String deleteBooks(List<Long> bookIds) {
        for (Long bookId : bookIds) {
            bookRepository.deleteById(bookId);
        }
        return "{\"message\":\"Seçilen kitap(lar) silindi!!\"}";
    }

    public Optional<Book> getBookById(Long bookId) {
        return bookRepository.findById(bookId);
    }

    public Book updateBook(Long bookId, Book newBook) {
        Book currentBook = bookRepository.getReferenceById(bookId);
        currentBook.setBookName(newBook.getBookName());
        currentBook.setPublisher(newBook.getPublisher());
        currentBook.setStock(newBook.getStock());
        currentBook.setWriter(newBook.getWriter());
        return bookRepository.save(currentBook);
    }

    public List<Book> searchBooksByPartialName(String partialBookName) {
        return bookRepository.findByBookNameContainingIgnoreCase(partialBookName);
    }
}
