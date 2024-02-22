package com.library.library.controller;

import com.library.library.model.Book;
import com.library.library.model.BorrowedBook;
import com.library.library.service.BookService;
import com.library.library.service.BorrowedBookService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/borrowedbook")
public class BorrowedBookController {
    private final BorrowedBookService borrowedBookService;

    private final BookService bookService;

    @Autowired
    public BorrowedBookController(BorrowedBookService borrowedBookService, BookService bookService) {
        this.borrowedBookService = borrowedBookService;
        this.bookService = bookService;
    }

    @PostMapping("/borrow")
    public BorrowedBook borrowBook(
            @RequestParam Long memberId,
            @RequestParam Long bookId,
            @RequestParam String borrowingDate,
            @RequestParam String returnDate) throws ParseException {

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date borrowingDateTime = dateFormat.parse(borrowingDate);
        Date returnDateTime = dateFormat.parse(returnDate);

        return borrowedBookService.borrowBook(memberId, bookId, borrowingDateTime, returnDateTime);
    }

    @PostMapping("/borrow-body")
    public BorrowedBook borrowBook(
            @RequestBody String data) throws ParseException {

        JSONObject json = new JSONObject(data);


        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date borrowingDateTime = dateFormat.parse(json.getString("borrowingDate"));
        Date returnDateTime = dateFormat.parse(json.getString("returnDate"));

        return borrowedBookService.borrowBook(json.getLong("memberId"), json.getLong("bookId"), borrowingDateTime, returnDateTime);
    }

    @DeleteMapping("/return-borrowed-book/{borrowedBookId}")
    public void deleteBorrowedBook(@PathVariable Long borrowedBookId) {
        BorrowedBook borrowedBook = borrowedBookService.getBorrowedBookById(borrowedBookId)
                .orElseThrow(() -> new RuntimeException("Ödünç alınan kitap bulunamadı."));

        Book book = borrowedBook.getBook();
        book.setStock(book.getStock() + 1);
        bookService.updateBook(book.getBookId(), book);

        borrowedBookService.deleteBorrowedBook(borrowedBookId);
    }

    @GetMapping("/borrows")
    public List<BorrowedBook> listBorrows() {
        return borrowedBookService.getAllBorrowedBooks();
    }


}

