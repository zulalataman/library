package com.library.library.repository;

import com.library.library.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByStaffNameContainingIgnoreCase(String staffName);
}
