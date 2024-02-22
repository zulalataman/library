package com.library.library.controller;

import com.library.library.model.Staff;
import com.library.library.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    @Autowired
    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping("/staffs")
    public List<Staff> listStaffs() {
        return staffService.getAllStaffs();
    }

    @PostMapping("/addstaff")
    public Staff saveStaff(@RequestBody Staff staff) {
        return staffService.addStaff(staff);
    }

    /*@PostMapping("/ekle")
    public ResponseEntity<Staff> uyeEkle(@RequestBody Staff staff) {
        Staff yeniUye = staffService.addStaff(staff);
        return new ResponseEntity<>(yeniUye, HttpStatus.CREATED);
    }*/

    @DeleteMapping("/deletestaff/{staffIds}")
    public String deleteStaff(@PathVariable List<Long> staffIds) {
        return staffService.deleteStaffs(staffIds);
    }


    @PutMapping("/updatestaff/{staffId}")
    public Staff updateStaff(@PathVariable Long staffId, @RequestBody Staff newStaff) {
        return staffService.updateStaff(staffId, newStaff);
    }

    @GetMapping("/getStaff/{staffId}")
    public Optional<Staff> getBook(@PathVariable Long staffId) {
        return staffService.getStaffById(staffId);
    }

    @GetMapping("/searchByPartialName/{partialStaffName}")
    public List<Staff> searchStaffsByPartialName(@PathVariable String partialStaffName) {
        return staffService.searchStaffsByPartialName(partialStaffName);
    }
}
