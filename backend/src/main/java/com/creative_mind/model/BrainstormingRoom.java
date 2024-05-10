package com.creative_mind.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Brainstorming Room")
public class BrainstormingRoom extends IdeaRoom{
    private static final String ROOM_TYPE = String.valueOf(RoomType.BRAINSTORMING);

    public BrainstormingRoom() {
        super();
    }
}
