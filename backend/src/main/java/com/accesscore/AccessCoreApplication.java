package com.accesscore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.io.FileInputStream;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

@SpringBootApplication
public class AccessCoreApplication {

    public static void main(String[] args) {
        loadDotEnvIfPresent();
        SpringApplication.run(AccessCoreApplication.class, args);
    }

    /**
     * Automatically loads .env from the backend root or project root if present,
     * without overriding system environment variables.
     */
    private static void loadDotEnvIfPresent() {
        File[] candidates = new File[] {
                new File(".env"),
                new File("backend/.env"),
                new File("../.env")
        };
        for (File file : candidates) {
            if (file.exists() && file.isFile()) {
                try (FileInputStream fis = new FileInputStream(file)) {
                    Properties props = new Properties();
                    props.load(new java.io.InputStreamReader(fis, StandardCharsets.UTF_8));
                    for (String name : props.stringPropertyNames()) {
                        if (System.getProperty(name) == null && System.getenv(name) == null) {
                            System.setProperty(name, props.getProperty(name));
                        }
                    }
                    break;
                } catch (Exception ignored) {
                }
            }
        }
    }
}
