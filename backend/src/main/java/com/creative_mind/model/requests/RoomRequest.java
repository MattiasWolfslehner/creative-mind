package com.creative_mind.model.requests;

public class RoomRequest {
    private String name;
    private String description;

    public RoomRequest() {
    }

    public RoomRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
