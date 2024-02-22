document.addEventListener("DOMContentLoaded", function () {
    const borrowBooksTable = document.getElementById("borrowBooksTable").getElementsByTagName('tbody')[0];
    const borrowBookButton = document.getElementById("borrowBookButton");
    const returnBookButton = document.getElementById("returnBookButton");
    const borrowedBookForm = document.getElementById("borrowedBookForm");
    const borrowBookForm = document.getElementById("borrowBookForm");
    const memberIdInput = document.getElementById("memberId");
    const bookIdInput = document.getElementById("bookId");
    const borrowingDateInput = document.getElementById("borrowingDate");
    const returnDateInput = document.getElementById("returnDate");
    const borrowBookSaveButton = document.getElementById("borrowBookSaveButton");
    const cancelButton = document.getElementById("cancelButton");

    borrowedBookGet();

    borrowBookButton.addEventListener("click", function () {
        borrowedBookForm.style.display = "block";
    });

    cancelButton.addEventListener("click", function () {
        borrowedBookForm.style.display = "none";
    });

    borrowBookSaveButton.addEventListener("click", function () {
        const memberId = memberIdInput.value;
        const bookId = bookIdInput.value;
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
                    console.log('Ödünç kitap başarıya eklendi:', data);

                    memberIdInput.value = "";
                    bookIdInput.value = "";
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

    returnBookButton.addEventListener("click", function () {
        const selectedCheckboxes = document.querySelectorAll('.borrowedbook-checkbox:checked');
        const borrowBookIdsToDelete = Array.from(selectedCheckboxes).map(checkbox => {
            const row = checkbox.closest('tr'); //checkboxa en yakın satırı bulur
            return row.dataset.borrowedbookId;
        });

        if (borrowBookIdsToDelete.length > 0) {
            deleteBooks(borrowBookIdsToDelete);
        } else {
            alert('Lütfen silmek için en az bir ödünç verilen kitap seçin.');
        }
    });

    function deleteBooks(borrowBookIdsToDelete) {
        const apiUrl = '/api/borrowedbook/return-borrowed-book/';  // Replace this with your actual API endpoint

        fetch(apiUrl + borrowBookIdsToDelete.join(','), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',  // Adjust content type based on your API requirements
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return true;
            })
            .then(data => {
                console.log('Ödünç kitap başarıyla teslim alındı:', data);
                location.reload(true);
            })
            .catch(error => {
                console.error('Ödünç kitap teslim alınırken hata:', error);
                alert('Kitap teslim alınırken bir hata oluştu. Lütfen tekrar deneyiniz.');
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

                    const memberIdCell = row.insertCell(1);
                    memberIdCell.textContent = borrowedbook.member.memberId;

                    const memberNameCell = row.insertCell(2);
                    memberNameCell.textContent = borrowedbook.member.memberName;

                    const memberLastNameCell = row.insertCell(3);
                    memberLastNameCell.textContent = borrowedbook.member.memberLastName;

                    const bookIdCell = row.insertCell(4);
                    bookIdCell.textContent = borrowedbook.book.bookId;

                    const bookNameCell = row.insertCell(5);
                    bookNameCell.textContent = borrowedbook.book.bookName;

                    const borrowingDateCell = row.insertCell(6);
                    borrowingDateCell.textContent = borrowedbook.borrowingDate;

                    const returnDateCell = row.insertCell(7);
                    returnDateCell.textContent = borrowedbook.returnDate;

                });
            })
            .catch(error => console.error('Kitap bilgileri alınamadı:', error));
    }

});