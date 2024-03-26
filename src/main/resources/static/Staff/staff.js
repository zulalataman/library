document.addEventListener("DOMContentLoaded", function () {
    const staffsTable = document.getElementById("staffsTable").getElementsByTagName('tbody')[0];
    const staffAddButton = document.getElementById("staffAddButton");
    const staffDeleteButton = document.getElementById("staffDeleteButton");
    const staffAddForm = document.getElementById("staffAddForm");
    const staffNameInput = document.getElementById("staffName");
    const staffLastNameInput = document.getElementById("staffLastName");
    const userNameInput = document.getElementById("userName");
    const userPasswordInput = document.getElementById("userPassword");
    const staffDutyInput = document.getElementById("staffDuty");
    const staffSaveButton = document.getElementById("staffSaveButton");
    const cancelButton = document.getElementById("cancelButton");
    const staffUpdateButton = document.getElementById("staffUpdateButton");
    const staffUpdateForm = document.getElementById("staffUpdateForm");
    const staffNameUpdateInput = document.getElementById("staffNameUpdate");
    const staffLastNameUpdateInput = document.getElementById("staffLastNameUpdate");
    const userNameUpdateInput = document.getElementById("userNameUpdate");
    const userPasswordUpdateInput = document.getElementById("userPasswordUpdate");
    const staffDutyUpdateInput = document.getElementById("staffDutyUpdate");
    const staffUpdateSaveButton = document.getElementById("staffUpdateSaveButton");
    const cancelUpdateButton = document.getElementById("cancelUpdateButton");
    const updateStaffIdInput = document.getElementById("updateStaffId");
    const staffSearchInput = document.getElementById("staffSearchInput");

    staffGet();

    staffAddButton.addEventListener("click", function () {
        staffAddForm.style.display = "block";
    });

    cancelButton.addEventListener("click", function () {
        staffAddForm.style.display = "none";
    });

    cancelUpdateButton.addEventListener("click", function () {
        staffUpdateForm.style.display = "none";
    })

    staffSaveButton.addEventListener("click", function () {
        const staffName = staffNameInput.value;
        const staffLastName = staffLastNameInput.value;
        const userName = userNameInput.value;
        const userPassword = userPasswordInput.value;
        const staffDuty = staffDutyInput.value;

        if (staffName && staffLastName && userName && userPassword && staffDuty) {
            const staffData = {
                staffName: staffName,
                staffLastName: staffLastName,
                userName: userName,
                userPassword: userPassword,
                staffDuty: staffDuty
            };
            fetch('/api/staff/addstaff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(staffData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Görevli başarıyla kaydedildi:', data);

                    staffNameInput.value = "";
                    staffLastNameInput.value = "";
                    userNameInput.value = "";
                    userPasswordInput.value = "";
                    staffDutyInput.value = "";

                    staffAddForm.style.display = "none";
                    location.reload(true);
                })
                .catch(error => {
                    console.error("Görevli eklenemedi:", error);
                    alert("Görevli eklenemedi. Lütfen tekrar deneyiniz.");
                });
        } else {
            alert("Lütfen tüm alanları doldurunuz.")
        }
    });

    staffDeleteButton.addEventListener("click", function () {
        const selectedCheckboxes = document.querySelectorAll('.staff-checkbox:checked');
        const staffIdsToDelete = Array.from(selectedCheckboxes).map(checkbox => {
            const row = checkbox.closest('tr');
            return row.dataset.staffId;
        });

        if (staffIdsToDelete.length > 0) {
            deleteStaffs(staffIdsToDelete);
        } else {
            alert('Lütfen silmek için en az bir görevli seçin.');
        }
    });

    function deleteStaffs(staffIdsToDelete) {
        const apiUrl = '/api/staff/deletestaff/';

        fetch(apiUrl + staffIdsToDelete.join(','), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Görevliler başarıyla silindi:', data);
                location.reload(true);
            })
            .catch(error => {
                console.error('Görevli silinemedi:', error);
                alert('Görevli silinemedi. Lütfen tekrar deneyiniz.');
            });
    }

    staffUpdateButton.addEventListener("click", function () {
        const selectedCheckbox = document.querySelector('.staff-checkbox:checked');

        if (selectedCheckbox) {
            const row = selectedCheckbox.closest('tr');
            const staffIdToUpdate = row.dataset.staffId;

            fetch(`/api/staff/getStaff/${staffIdToUpdate}`)
                .then(response => response.json())
                .then(staff => {

                    updateStaffIdInput.value = staff.staffId;
                    staffNameUpdateInput.value = staff.staffName;
                    staffLastNameUpdateInput.value = staff.staffLastName;
                    userNameUpdateInput.value = staff.userName;
                    userPasswordUpdateInput.value = staff.userPassword;
                    staffDutyUpdateInput.value = staff.staffDuty;

                    staffUpdateForm.style.display = "block";
                })
                .catch(error => console.error('Görevli detayları alınamadı:', error));
        } else {
            alert('Lütfen güncellemek için bir görevli seçiniz.');
        }
    });

    staffUpdateSaveButton.addEventListener("click", function () {
        const staffId = updateStaffIdInput.value;
        const updatedStaffName = staffNameUpdateInput.value;
        const updatedStaffLastName = staffLastNameUpdateInput.value;
        const updatedUserName = userNameUpdateInput.value;
        const updatedUserPassword = userPasswordUpdateInput.value;
        const updatedStaffDuty = staffDutyUpdateInput.value;

        if (updatedStaffName && updatedStaffLastName && updatedUserName && updatedUserPassword && updatedStaffDuty) {
            const updateStaffData = {
                staffName: updatedStaffName,
                staffLastName: updatedStaffLastName,
                userName: updatedUserName,
                userPassword: updatedUserPassword,
                staffDuty: updatedStaffDuty
            };

            fetch(`/api/staff/updatestaff/${staffId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateStaffData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Görevli güncellendi:', data);
                    staffUpdateForm.style.display = "none";
                    location.reload(true);
                })
                .catch(error => {
                    console.log('Görevli güncellenme hatası:', error);
                    alert("Görevli güncellenemedi. Lütfen tekrar deneyiniz.");
                });
        }
    });

    function staffGet() {
        fetch('/api/staff/staffs')
            .then(response => response.json())
            .then(data => {
                data.forEach(staff => {
                    const row = staffsTable.insertRow();
                    row.dataset.staffId = staff.staffId;
                    const checkboxCell = row.insertCell(0);
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'staff-checkbox';
                    checkboxCell.appendChild(checkbox);

                    const staffNameCell = row.insertCell(1);
                    staffNameCell.textContent = staff.staffName;

                    const staffLastNameCell = row.insertCell(2);
                    staffLastNameCell.textContent = staff.staffLastName;

                    const userNameCell = row.insertCell(3);
                    userNameCell.textContent = staff.userName;

                    const userPasswordCell = row.insertCell(4);
                    userPasswordCell.textContent = staff.userPassword;

                    const staffDutyCell = row.insertCell(5);
                    staffDutyCell.textContent = staff.staffDuty;
                });
            })
            .catch(error => console.error('Görevli bilgileri alınamadı', error));
    }

    staffSearchInput.addEventListener("input", function () {
        const searchTerm = staffSearchInput.value;

        if (searchTerm || searchTerm.length >= 2) {
            searchStaffsByPartialNameOrLastName(searchTerm);
        } else {
            location.reload(true);
        }
    });

    function searchStaffsByPartialNameOrLastName(searchTerm) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('searchTerm', searchTerm);

        fetch(`/api/staff/search?${urlSearchParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                clearTable();

                const tableBody = document.getElementById('staffsTable').getElementsByTagName('tbody')[0];
                data.forEach(staff => {
                    const row = tableBody.insertRow();
                    row.dataset.staffId = staff.staffId;
                    const checkboxCell = row.insertCell(0);
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'staff-checkbox';
                    checkboxCell.appendChild(checkbox);

                    const staffNameCell = row.insertCell(1);
                    staffNameCell.textContent = staff.staffName;

                    const staffLastNameCell = row.insertCell(2);
                    staffLastNameCell.textContent = staff.staffLastName;

                    const userNameCell = row.insertCell(3);
                    userNameCell.textContent = staff.userName;

                    const userPasswordCell = row.insertCell(4);
                    userPasswordCell.textContent = staff.userPassword;

                    const staffDutyCell = row.insertCell(5);
                    staffDutyCell.textContent = staff.staffDuty;
                });
            })
            .catch(error => console.error('Üye arama hatası:', error));
    }

    function clearTable() {
        const tableBody = document.getElementById('staffsTable').getElementsByTagName('tbody')[0];
        if (tableBody) {
            tableBody.innerHTML = '';
        }
    }
});