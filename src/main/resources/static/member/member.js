document.addEventListener("DOMContentLoaded", function () {
    const membersTable = document.getElementById("membersTable").getElementsByTagName('tbody')[0];
    const memberAddButton = document.getElementById("memberAddButton");
    const memberAddForm = document.getElementById("memberAddForm");
    const memberNameInput = document.getElementById("memberName");
    const memberLastNameInput = document.getElementById("memberLastName");
    const memberAgeInput = document.getElementById("memberAge");
    const memberSaveButton = document.getElementById("memberSaveButton");
    const cancelButton = document.getElementById("cancelButton");
    const memberDeleteButton = document.getElementById("memberDeleteButton");
    const memberUpdateForm = document.getElementById("memberUpdateForm");
    const updateMemberIdInput = document.getElementById("updateMemberId");
    const updateMemberNameInput = document.getElementById("updateMemberName");
    const updateMemberLastNameInput = document.getElementById("updateMemberLastName");
    const updateMemberAgeInput = document.getElementById("updateMemberAge");
    const memberUpdateSaveButton = document.getElementById("memberUpdateSaveButton");
    const cancelUpdateButton = document.getElementById("cancelUpdateButton");
    const memberUpdateButton = document.getElementById("memberUpdateButton");
    const memberSearchInput = document.getElementById("memberSearchInput");
    const modal = document.getElementById("memberModal");
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    const cancelDeleteButton = document.getElementById("cancelDeleteButton")

    memberGet();

    memberAddButton.addEventListener("click", function () {
        memberAddForm.style.display = "block";
    });

    cancelButton.addEventListener("click", function () {
        memberAddForm.style.display = "none";
    });

    cancelUpdateButton.addEventListener("click", function () {
        memberUpdateForm.style.display = "none";
    });

    memberSaveButton.addEventListener("click", function () {
        const memberName = memberNameInput.value;
        const memberLastName = memberLastNameInput.value;
        const memberAge = memberAgeInput.value;

        if (memberName && memberLastName && memberAge) {
            const memberData = {
                memberName: memberName,
                memberLastName: memberLastName,
                memberAge: memberAge
            };

            fetch('/api/member/addmember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(memberData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Üye başarıyla eklendi:', data);

                    memberNameInput.value = "";
                    memberLastNameInput.value = "";
                    memberAgeInput.value = "";

                    memberAddForm.style.display = "none";
                    location.reload(true);
                })
                .catch(error => {
                    console.error('Üye eklenirken hata:', error);
                    alert('Üye eklenemedi. Lütfen tekrar deneyiniz..');
                });
        } else {
            alert("Lütfen tüm alanları doldurun.");
        }
    });

    memberDeleteButton.addEventListener("click", function () {
        const selectedCheckboxes = document.querySelectorAll('.member-checkbox:checked');
        const memberIdsToDelete = Array.from(selectedCheckboxes).map(checkbox => {
            const row = checkbox.closest('tr');
            return row.dataset.memberId;
        });

        if (memberIdsToDelete.length > 0) {
            modal.style.display = "block"
        } else {
            alert('Lütfen silmek için en az bir üye seçin.');
        }
    });

    confirmDeleteButton.addEventListener("click", function () {
        const selectedCheckboxes = document.querySelectorAll('.member-checkbox:checked');
        const memberIdsToDelete = Array.from(selectedCheckboxes).map(checkbox => {
            const row = checkbox.closest('tr');
            return row.dataset.memberId;
        });

        deleteMembers(memberIdsToDelete);
        modal.style.display = "none";
    });

    cancelDeleteButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    function deleteMembers(memberIdsToDelete) {
        const apiUrl = '/api/member/deletemember/';

        fetch(apiUrl + memberIdsToDelete.join(','), {
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
                console.log('Üye başarıyla silindi:', data);
                location.reload(true);
            })
            .catch(error => {
                console.error('Üye silinirken hata:', error);
                alert('Üye silinirken hata oluştu. Lütfen tekrar deneyiniz.');
            });
    }

    memberUpdateButton.addEventListener("click", function () {
        const selectedCheckbox = document.querySelector('.member-checkbox:checked');

        if (selectedCheckbox) {
            const row = selectedCheckbox.closest('tr');
            const memberIdToUpdate = row.dataset.memberId;

            fetch(`/api/member/getMember/${memberIdToUpdate}`)
                .then(response => response.json())
                .then(member => {

                    updateMemberIdInput.value = member.memberId;
                    updateMemberNameInput.value = member.memberName;
                    updateMemberLastNameInput.value = member.memberLastName;
                    updateMemberAgeInput.value = member.memberAge;

                    memberUpdateForm.style.display = "block";
                })
                .catch(error => console.error('Üye detayları alınamadı:', error));
        } else {
            alert('Lütfen güncellemek için bir üye seçiniz.');
        }
    });

    memberUpdateSaveButton.addEventListener("click", function () {
        const memberId = updateMemberIdInput.value;
        const updatedMemberName = updateMemberNameInput.value;
        const updatedMemberLastName = updateMemberLastNameInput.value;
        const updatedMemberAge = updateMemberAgeInput.value;

        if (updatedMemberName && updatedMemberLastName && updatedMemberAge) {
            const updatedMemberData = {
                memberName: updatedMemberName,
                memberLastName: updatedMemberLastName,
                memberAge: updatedMemberAge
            };

            fetch(`/api/member/updatemember/${memberId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedMemberData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Üye güncellendi:', data);
                    memberUpdateForm.style.display = "none";
                    location.reload(true);
                })
                .catch(error => {
                    console.log('Üye güncellenme hatası:', error);
                    alert("Üye güncellenemedi. Lütfen tekrar deneyiniz.");
                });
        } else {
            alert("Lütfen tüm alanları doldurunuz.");
        }
    });

    function memberGet() {
        fetch('/api/member/members')
            .then(response => response.json())
            .then(data => {
                data.forEach(member => {
                    const row = membersTable.insertRow();
                    row.dataset.memberId = member.memberId;
                    const checkboxCell = row.insertCell(0);
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'member-checkbox';
                    checkboxCell.appendChild(checkbox);

                    const memberIdCell = row.insertCell(1);
                    memberIdCell.textContent = member.memberId;

                    const memberNameCell = row.insertCell(2);
                    memberNameCell.textContent = member.memberName;

                    const memberLastNameCell = row.insertCell(3);
                    memberLastNameCell.textContent = member.memberLastName;

                    const memberAgeCell = row.insertCell(4);
                    memberAgeCell.textContent = member.memberAge;
                });
            })
            .catch(error => console.error('Üye bilgileri alınamadı:', error));
    }


    memberSearchInput.addEventListener("input", function () {
        const searchTerm = memberSearchInput.value;

        if (searchTerm || searchTerm.length >= 2) {
            searchMembersByPartialNameOrLastName(searchTerm);
        } else {
            location.reload(true);
        }
    });

    function searchMembersByPartialNameOrLastName(searchTerm) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('searchTerm', searchTerm);

        fetch(`/api/member/search?${urlSearchParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                clearTable();

                const tableBody = document.getElementById('membersTable').getElementsByTagName('tbody')[0];
                data.forEach(member => {
                    const row = tableBody.insertRow();
                    row.dataset.memberId = member.memberId;
                    const checkboxCell = row.insertCell(0);
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'member-checkbox';
                    checkboxCell.appendChild(checkbox);

                    const memberIdCell = row.insertCell(1);
                    memberIdCell.textContent = member.memberId;

                    const memberNameCell = row.insertCell(2);
                    memberNameCell.textContent = member.memberName;

                    const memberLastNameCell = row.insertCell(3);
                    memberLastNameCell.textContent = member.memberLastName;

                    const memberAgeCell = row.insertCell(4);
                    memberAgeCell.textContent = member.memberAge;
                });
            })
            .catch(error => console.error('Üye arama hatası:', error));
    }

    function clearTable() {
        const tableBody = document.getElementById('membersTable').getElementsByTagName('tbody')[0];
        if (tableBody) {
            tableBody.innerHTML = '';
        }
    }
});

