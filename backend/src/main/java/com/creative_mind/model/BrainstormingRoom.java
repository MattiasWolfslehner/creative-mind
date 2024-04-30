package com.creative_mind.model;

import jakarta.persistence.Entity;

@Entity
public class BrainstormingRoom extends IdeaRoom{
    private static final String ROOM_TYPE = String.valueOf(RoomType.BRAINSTORMING);

    public BrainstormingRoom() {
        super();
    }
}
