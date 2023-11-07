package com.creative_mind.model;

import java.util.UUID;

public class User {
    private String uuid;

    public User() {
        this.uuid = UUID.randomUUID().toString();
    }

    public String getUuid() {
        return uuid;
    }

}
