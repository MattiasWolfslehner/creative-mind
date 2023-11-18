package com.creative_mind.model.requests;
import java.util.UUID;

public class ParticipantionRequest {
    private String roomType;
    private UUID roomId;
    private UUID memberId;

    public String getRoomType() {
        return roomType;
    }

    public UUID getRoomId() {
        return roomId;
    }

    public UUID getMemberId() {
        return memberId;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public void setRoomId(UUID roomId) {
        this.roomId = roomId;
    }

    public void setMemberId(UUID memberId) {
        this.memberId = memberId;
    }

    public ParticipantionRequest() {
    }

    public ParticipantionRequest(UUID roomId, UUID memberId) {
        this.roomId = roomId;
        this.memberId = memberId;
    }
}
