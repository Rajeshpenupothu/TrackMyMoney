package com.trackmymoney.backend;

import com.trackmymoney.backend.entity.User;
import com.trackmymoney.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class TrackmymoneyBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrackmymoneyBackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initDemoUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByEmail("demo@gmail.com")) {
				User demoUser = new User();
				demoUser.setName("Demo User");
				demoUser.setEmail("demo@gmail.com");
				demoUser.setPassword(passwordEncoder.encode("demo123"));
				userRepository.save(demoUser);
				System.out.println("Initialized Demo User: demo@gmail.com / demo123");
			}
		};
	}

}
