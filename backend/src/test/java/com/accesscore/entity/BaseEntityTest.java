package com.accesscore.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class BaseEntityTest {

    @Test
    void lifecycleCallbacksPopulateTimestamps() {
        ServiceRequest entity = new ServiceRequest();
        entity.onCreate();
        assertThat(entity.getCreatedAt()).isNotNull();
        assertThat(entity.getUpdatedAt()).isNotNull();

        LocalDateTime initialUpdated = entity.getUpdatedAt();
        entity.onUpdate();
        assertThat(entity.getUpdatedAt()).isAfterOrEqualTo(initialUpdated);
    }
}
