package com.creative_mind.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Brainwriting Room")
public class BrainwritingRoom extends IdeaRoom {
    private static final String ROOM_TYPE = String.valueOf(RoomType.BRAINWRITING);

    @Override
    public long getMaxTimerForRoom() {
        return 400000L;
    }

    public BrainwritingRoom() {
        super();
    }
}
