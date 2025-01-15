package com.creative_mind.model.requests;

import com.creative_mind.model.RoomStatus;

public class RoomStateRequest {
    private RoomStatus roomState;


    public RoomStatus getRoomState() {
        return roomState;
    }

    public void setRoomState(RoomStatus roomState) {
        this.roomState = roomState;
    }
}
