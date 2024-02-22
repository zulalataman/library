package com.library.library.service;

import com.library.library.model.Book;
import com.library.library.model.BorrowedBook;
import com.library.library.model.Member;
import com.library.library.repository.BorrowedBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowedBookService {

    private final BorrowedBookRepository borrowedBookRepository;

    private final BookService bookService;

    private final MemberService memberService;

    @Autowired
    public BorrowedBookService(BorrowedBookRepository borrowedBookRepository, BookService bookService, MemberService memberService) {
        this.borrowedBookRepository = borrowedBookRepository;
        this.bookService = bookService;
        this.memberService = memberService;
    }

    public BorrowedBook borrowBook(Long memberId, Long bookId, Date borrowingDate, Date returnDate) {
        Member member = memberService.getMemberById(memberId).orElseThrow(() -> new RuntimeException("Üye bulunamadı."));
        Book book = bookService.getBookById(bookId).orElseThrow(() -> new RuntimeException("Kitap bulunamadı."));

        if (book.getStock() > 0) {
            book.setStock(book.getStock() - 1);
            bookService.updateBook(book.getBookId(), book);

            BorrowedBook borrowedBook = new BorrowedBook();
            borrowedBook.setMember(member);
            borrowedBook.setBook(book);
            borrowedBook.setBorrowingDate(borrowingDate);
            borrowedBook.setReturnDate(returnDate);

            return borrowedBookRepository.save(borrowedBook);
        } else {
            throw new RuntimeException("Stokta yeterli kitap bulunmuyor.");
        }
    }

    public void deleteBorrowedBook(Long borrowedBookId) {
        borrowedBookRepository.deleteById(borrowedBookId);
    }

    public Optional<BorrowedBook> getBorrowedBookById(Long borrowedBookId) {
        return borrowedBookRepository.findById(borrowedBookId);
    }

    public List<BorrowedBook> getAllBorrowedBooks() {
        return borrowedBookRepository.findAll();
    }

}
