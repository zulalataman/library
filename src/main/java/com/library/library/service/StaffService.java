package com.library.library.service;

import com.library.library.model.Staff;
import com.library.library.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    private final StaffRepository staffRepository;

    @Autowired
    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public List<Staff> getAllStaffs() {
        return staffRepository.findAll();
    }

    public Staff addStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    public String deleteStaffs(List<Long> staffIds) {
        for (Long staffId : staffIds) {
            staffRepository.deleteById(staffId);
        }
        return "{\"message\":\"Seçilen görevli(ler) silindi!!\"}";
    }

    public Optional<Staff> getStaffById(Long staffId) {
        return staffRepository.findById(staffId);
    }

    public Staff updateStaff(Long staffId, Staff newStaff) {
        Staff currentStaff = staffRepository.getReferenceById(staffId);
        currentStaff.setStaffName(newStaff.getStaffName());
        currentStaff.setStaffLastName(newStaff.getStaffLastName());
        currentStaff.setUserName(newStaff.getUserName());
        currentStaff.setUserPassword(newStaff.getUserPassword());
        currentStaff.setStaffDuty(newStaff.getStaffDuty());

        return staffRepository.save(currentStaff);
    }

    public List<Staff> searchStaffsByPartialName(String partialStaffName) {
        return staffRepository.findByStaffNameContainingIgnoreCase(partialStaffName);
    }

    public List<Staff> searchStaffByPartialNameOrLastName(String searchTerm) {
        return staffRepository.findByStaffNameOrStaffLastNameContainingIgnoreCase(searchTerm);
    }
}
