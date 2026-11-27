package com.accesscore.dto;

public class HealthResponse {
    private String status;
    private String application;
    private String message;
    private String database;

    public HealthResponse() {
    }

    public HealthResponse(String status, String application, String message) {
        this.status = status;
        this.application = application;
        this.message = message;
    }

    public HealthResponse(String status, String application, String message, String database) {
        this.status = status;
        this.application = application;
        this.message = message;
        this.database = database;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }
}
