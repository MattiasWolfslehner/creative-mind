package com.creative_mind.model.requests;

import java.util.UUID;

public class ParameterRequest {
    private String title;
    private UUID roomId;
    private UUID memberId;

    public ParameterRequest() {
    }

    public ParameterRequest(UUID roomId, UUID memberId) {
        this.roomId = roomId;
        this.memberId = memberId;
    }

    public ParameterRequest(String content, UUID roomId, UUID memberId) {
        this.title = content;
        this.roomId = roomId;
        this.memberId = memberId;
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

    public UUID getMemberId() {
        return memberId;
    }

    public void setMemberId(UUID memberId) {
        this.memberId = memberId;
    }
}
