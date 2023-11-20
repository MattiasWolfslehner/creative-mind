package com.creative_mind.model.requests;

import java.util.UUID;

public class IdeaRequest {
    private String content;
    private UUID roomId;
    private UUID memberId;

    public IdeaRequest() {
    }

    public IdeaRequest(UUID roomId, UUID memberId) {
        this.roomId = roomId;
        this.memberId = memberId;
    }

    public IdeaRequest(String content, UUID roomId, UUID memberId) {
        this.content = content;
        this.roomId = roomId;
        this.memberId = memberId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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
