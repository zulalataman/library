document.addEventListener("DOMContentLoaded", function () {
    const booksTable = document.getElementById("booksTable").getElementsByTagName('tbody')[0];
    const bookAddButton = document.getElementById("bookAddButton");
    const bookAddForm = document.getElementById("bookAddForm");
    const bookForm = document.getElementById("bookForm");
    const bookNameInput = document.getElementById("bookName");
    const writerInput = document.getElementById("writer");
    const publisherInput = document.getElementById("publisher");
    const stockInput = document.getElementById("stock");
    const bookSaveButton = document.getElementById("bookSaveButton");
    const cancelButton = document.getElementById("cancelButton");
    const bookDeleteButton = document.getElementById("bookDeleteButton");
    const bookUpdateForm = document.getElementById("bookUpdateForm");
    const updateBookForm = document.getElementById("updateBookForm");
    const updateBookIdInput = document.getElementById("updateBookId");
    const updateBookNameInput = document.getElementById("updateBookName");
    const updateWriterInput = document.getElementById("updateWriter");
    const updatePublisherInput = document.getElementById("updatePublisher");
    const updateStockInput = document.getElementById("updateStock");
    const bookUpdateSaveButton = document.getElementById("bookUpdateSaveButton");
    const cancelUpdateButton = document.getElementById("cancelUpdateButton");
    const bookUpdateButton = document.getElementById("bookUpdateButton");
    const bookSearchInput = document.getElementById("bookSearchInput");


    bookGet();

    bookAddButton.addEventListener("click", function () {
        bookAddForm.style.display = "block";
    });

    cancelButton.addEventListener("click", function () {
        bookAddForm.style.display = "none";
    });

    cancelUpdateButton.addEventListener("click", function () {
        bookUpdateForm.style.display = "none";
    });

    bookSaveButton.addEventListener("click", function () {
        const bookName = bookNameInput.value;
        const writer = writerInput.value;
        const publisher = publisherInput.value;
        const stock = stockInput.value;

        if (bookName && writer && publisher && stock) {
            const bookData = {
                bookName: bookName,
                writer: writer,
                publisher: publisher,
                stock: stock
            };

            fetch('/api/book/addbook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Book added successfully:', data);

                    bookNameInput.value = "";
                    writerInput.value = "";
                    publisherInput.value = "";
                    stockInput.value = "";

                    bookAddForm.style.display = "none";
                    location.reload(true);
                })
                .catch(error => {
                    console.error('Error adding book:', error);
                    alert('Kitap eklenemedi. Lütfen tekrar deneyiniz..');
                });
        } else {
            alert("Lütfen tüm alanları doldurun.");
        }
    });

    bookDeleteButton.addEventListener("click", function () {
        const selectedCheckboxes = document.querySelectorAll('.book-checkbox:checked');
        const bookIdsToDelete = Array.from(selectedCheckboxes).map(checkbox => {
            const row = checkbox.closest('tr'); //checkboxa en yakın satırı bulur
            return row.dataset.bookId; //kitap ıdsini alır
        });

        if (bookIdsToDelete.length > 0) {
            deleteBooks(bookIdsToDelete);
        } else {
            alert('Lütfen silmek için en az bir kitap seçin.');
        }
    });

    function deleteBooks(bookIdsToDelete) {
        const apiUrl = '/api/book/deletebook/';  // Replace this with your actual API endpoint

        fetch(apiUrl + bookIdsToDelete.join(','), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',  // Adjust content type based on your API requirements
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Books deleted successfully:', data);
                location.reload(true);
            })
            .catch(error => {
                console.error('Error deleting books:', error);
                alert('Error deleting books. Please try again.');
            });
    }

    bookUpdateButton.addEventListener("click", function () {
        const selectedCheckbox = document.querySelector('.book-checkbox:checked');

        if (selectedCheckbox) {
            const row = selectedCheckbox.closest('tr');
            const bookIdToUpdate = row.dataset.bookId;

            fetch(`/api/book/getBook/${bookIdToUpdate}`)
                .then(response => response.json())
                .then(book => {

                    updateBookIdInput.value = book.bookId;
                    updateBookNameInput.value = book.bookName;
                    updateWriterInput.value = book.writer;
                    updatePublisherInput.value = book.publisher;
                    updateStockInput.value = book.stock;

                    bookUpdateForm.style.display = "block";
                })
                .catch(error => console.error('Kitap detayları alınamadı:', error));
        } else {
            alert('Lütfen güncellemek için bir kitap seçiniz.');
        }
    });

    bookUpdateSaveButton.addEventListener("click", function () {
        const bookId = updateBookIdInput.value;
        const updatedBookName = updateBookNameInput.value;
        const updatedWriter = updateWriterInput.value;
        const updatedPublisher = updatePublisherInput.value;
        const updatedStock = updateStockInput.value;
        if (updatedBookName && updatedWriter && updatedPublisher && updatedStock) {
            const updatedBookData = {
                bookName: updatedBookName,
                writer: updatedWriter,
                publisher: updatedPublisher,
                stock: updatedStock
            };

            fetch(`/api/book/updatebook/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedBookData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Kitap güncellendi:', data);
                    bookUpdateForm.style.display = "none";
                    location.reload(true);
                })
                .catch(error => {
                    console.log('Kitap güncellenme hatası:', error);
                    alert("Kitap güncellenemedi. Lütfen tekrar deneyiniz.");
                });
        } else {
            alert("Lütfen tüm alanları doldurunuz.");
        }
    });

    function bookGet() {
        fetch('/api/book/books')
            .then(response => response.json())
            .then(data => {
                data.forEach(book => {
                    const row = booksTable.insertRow();
                    row.dataset.bookId = book.bookId;
                    const checkboxCell = row.insertCell(0);
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'book-checkbox';
                    checkboxCell.appendChild(checkbox);

                    const bookIdCell = row.insertCell(1);
                    bookIdCell.textContent = book.bookId;

                    const booknameCell = row.insertCell(2);
                    booknameCell.textContent = book.bookName;

                    const writerCell = row.insertCell(3);
                    writerCell.textContent = book.writer;

                    const publisherCell = row.insertCell(4);
                    publisherCell.textContent = book.publisher;

                    const stockCell = row.insertCell(5);
                    stockCell.textContent = book.stock;
                });
            })
            .catch(error => console.error('Kitap bilgileri alınamadı:', error));
    }

    bookSearchInput.addEventListener("input", function () {
        const partialBookName = bookSearchInput.value;

        // Boş bir arama veya belirli bir uzunlukta bir arama yapmak istendiğinde arama yap
        if (partialBookName || partialBookName.length >= 2) {
            searchBooksByPartialName(partialBookName);
        } else {
            // Boş arama yapıldığında tüm kayıtları getir
            location.reload(true);
        }
    });

// Kitapları kısmi isme göre aramak için fonksiyon
    function searchBooksByPartialName(partialBookName) {
        fetch(`/api/book/searchByPartialName/${partialBookName}`)
            .then(response => response.json())
            .then(data => {
                // Tabloyu temizle
                clearTable();

                // Arama sonuçlarıyla tabloyu doldur
                const tableBody = document.getElementById('booksTable').getElementsByTagName('tbody')[0];
                data.forEach(book => {
                    const row = tableBody.insertRow();
                    row.dataset.bookId = book.bookId;
                    const checkboxCell = row.insertCell(0);
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'book-checkbox';
                    checkboxCell.appendChild(checkbox);

                    const bookIdCell = row.insertCell(1);
                    bookIdCell.textContent = book.bookId;

                    const booknameCell = row.insertCell(2);
                    booknameCell.textContent = book.bookName;

                    const writerCell = row.insertCell(3);
                    writerCell.textContent = book.writer;

                    const publisherCell = row.insertCell(4);
                    publisherCell.textContent = book.publisher;

                    const stockCell = row.insertCell(5);
                    stockCell.textContent = book.stock;
                });
            })
            .catch(error => console.error('Kitap arama hatası:', error));
    }

    // Tabloyu temizlemek için fonksiyon
    function clearTable() {
        const tableBody = document.getElementById('booksTable').getElementsByTagName('tbody')[0];
        if (tableBody) {
            tableBody.innerHTML = ''; // Mevcut içeriği temizle
        }
    }
});

