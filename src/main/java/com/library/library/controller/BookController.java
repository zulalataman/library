package com.library.library.controller;

import com.library.library.model.Book;
import com.library.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/book")
public class BookController {

    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/books")
    public List<Book> listBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping("/addbook")
    public Book saveBook(@RequestBody Book book) {
        return bookService.addBooks(book);
    }

    @DeleteMapping("/deletebook/{bookIds}")
    public String deleteBook(@PathVariable List<Long> bookIds) {
        return bookService.deleteBooks(bookIds);
    }

    @PutMapping("/updatebook/{bookId}")
    public Book updateBook(@PathVariable Long bookId, @RequestBody Book newBook) {
        return bookService.updateBook(bookId, newBook);
    }

    @GetMapping("/getBook/{bookId}")
    public Optional<Book> getBook(@PathVariable Long bookId) {
        return bookService.getBookById(bookId);
    }

    @GetMapping("/searchByPartialName/{partialBookName}")
    public List<Book> searchBooksByPartialName(@PathVariable String partialBookName) {
        return bookService.searchBooksByPartialName(partialBookName);
    }

}
