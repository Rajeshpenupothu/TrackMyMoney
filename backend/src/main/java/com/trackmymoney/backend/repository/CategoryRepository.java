package com.trackmymoney.backend.repository;

import com.trackmymoney.backend.entity.Category;
import com.trackmymoney.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUserAndType(User user, String type);

    boolean existsByUserAndNameAndType(User user, String name, String type);
}
