package com.creative_mind.model;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@DiscriminatorValue("Brainwriting Room")
public class BrainwritingRoom extends IdeaRoom {
    private static final String ROOM_TYPE = String.valueOf(RoomType.BRAINWRITING);

    public BrainwritingRoom() {
        super();
    }
}
