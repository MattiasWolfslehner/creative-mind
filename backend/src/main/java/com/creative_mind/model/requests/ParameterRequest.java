package com.creative_mind.model.requests;

import java.util.UUID;

public class ParameterRequest {
    private String title;
    private UUID roomId;
    public ParameterRequest() {
    }

    public ParameterRequest(UUID roomId) {
        this.roomId = roomId;
    }

    public ParameterRequest(String content, UUID roomId) {
        this.title = content;
        this.roomId = roomId;
    }

    public ParameterRequest(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public UUID getRoomId() {
        return roomId;
    }

    public void setRoomId(UUID roomId) {
        this.roomId = roomId;
    }
}
