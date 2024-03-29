document.addEventListener("DOMContentLoaded", function () {
    const borrowBooksTable = document.getElementById("borrowBooksTable").getElementsByTagName('tbody')[0];
    const borrowBookButton = document.getElementById("borrowBookButton");
    const returnBookButton = document.getElementById("returnBookButton");
    const borrowedBookForm = document.getElementById("borrowedBookForm");
    const memberIdInput = document.getElementById("memberId");
    const bookSelect = document.getElementById("bookId");
    const borrowingDateInput = document.getElementById("borrowingDate");
    const returnDateInput = document.getElementById("returnDate");
    const borrowBookSaveButton = document.getElementById("borrowBookSaveButton");
    const cancelButton = document.getElementById("cancelButton");
    const modal = document.getElementById("borrowedbookModal");
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    const cancelDeleteButton = document.getElementById("cancelDeleteButton");

    borrowedBookGet();

    borrowBookButton.addEventListener("click", function () {
        borrowedBookForm.style.display = "block";
    });

    cancelButton.addEventListener("click", function () {
        borrowedBookForm.style.display = "none";
    });

    borrowBookSaveButton.addEventListener("click", function () {
        const memberId = memberIdInput.value;
        const bookId = bookSelect.value;
        const borrowingDate = borrowingDateInput.value;
        const returnDate = returnDateInput.value;

        if (memberId && bookId && borrowingDate && returnDate) {
            const borrowBookData = {
                memberId: memberId,
                bookId: bookId,
                borrowingDate: borrowingDate,
                returnDate: returnDate
            };

            fetch('/api/borrowedbook/borrow-body', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(borrowBookData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Ödünç kitap başarıya verildi:', data);

                    memberIdInput.value = "";
                    bookSelect.value = "";
                    borrowingDateInput.value = "";
                    returnDateInput.value = "";

                    borrowedBookForm.style.display = "none";
                    location.reload(true);
                })
                .catch(error => {
                    console.error('Ödünç kitap verilemedi:', error);
                    alert('Ödünç kitap verilemedi. Lütfen tekrar deneyiniz..');
                });
        } else {
            alert("Lütfen tüm alanları doldurun.");
        }
    });

    fetch('/api/book/books')
        .then(response => response.json())
        .then(data => {
            data.forEach(book => {
                const option = document.createElement("option");
                option.value = book.bookId;
                option.textContent = book.bookName;
                bookSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Kitaplar alınamadı:', error);
            alert('Kitaplar alınamadı, lütfen tekrar deneyiniz.')
        })


    returnBookButton.addEventListener("click", function () {
        const selectedCheckboxes = document.querySelectorAll('.borrowedbook-checkbox:checked');
        const borrowBookIdsToDelete = Array.from(selectedCheckboxes).map(checkbox => {
            const row = checkbox.closest('tr');
            return row.dataset.borrowedbookId;
        });

        if (borrowBookIdsToDelete.length > 0) {
            modal.style.display = "block";
        } else {
            alert('Lütfen silmek için en az bir ödünç verilen kitap seçin.');
        }
    });

    confirmDeleteButton.addEventListener("click", function () {
        const selectedCheckboxes = document.querySelectorAll('.borrowedbook-checkbox:checked');
        const borrowBookIdsToDelete = Array.from(selectedCheckboxes).map(checkbox => {
            const row = checkbox.closest('tr');
            return row.dataset.borrowedbookId;
        });
        returnBooks(borrowBookIdsToDelete);
        modal.style.display = "none";
    });

    cancelDeleteButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    function returnBooks(borrowBookIdsToDelete) {
        const apiUrl = '/api/borrowedbook/return-borrowed-books/';

        fetch(apiUrl + borrowBookIdsToDelete.join(','), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Yanıt oluşturulurken bir hata oluştu.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Ödünç kitap başarıyla teslim alındı:', data);
                location.reload(true);
            })
            .catch(error => {
                console.error('Teslim alma hatası:', error);
                alert('Kitap teslim alınamadı. Lütfen tekrar deneyiniz.');
            });
    }

    function borrowedBookGet() {
        fetch('/api/borrowedbook/borrows')
            .then(response => response.json())
            .then(data => {
                data.forEach(borrowedbook => {
                    const row = borrowBooksTable.insertRow();
                    row.dataset.borrowedbookId = borrowedbook.borrowedbookId;
                    const checkboxCell = row.insertCell(0);
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'borrowedbook-checkbox';
                    checkboxCell.appendChild(checkbox);

                    const memberNameCell = row.insertCell(1);
                    memberNameCell.textContent = borrowedbook.member.memberName;

                    const memberLastNameCell = row.insertCell(2);
                    memberLastNameCell.textContent = borrowedbook.member.memberLastName;

                    const bookIdCell = row.insertCell(3);
                    bookIdCell.textContent = borrowedbook.book.bookId;

                    const bookNameCell = row.insertCell(4);
                    bookNameCell.textContent = borrowedbook.book.bookName;

                    const borrowingDateCell = row.insertCell(5);
                    borrowingDateCell.textContent = borrowedbook.borrowingDate;

                    const returnDateCell = row.insertCell(6);
                    returnDateCell.textContent = borrowedbook.returnDate;

                });
            })
            .catch(error => console.error('Kitap bilgileri alınamadı:', error));
    }

});