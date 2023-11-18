package com.creative_mind.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.Set;

@Entity
@DiscriminatorValue("Brainwriting Room")
public class BrainwritingRoom extends Room {

    private static final String ROOM_TYPE = String.valueOf(RoomType.BRAINWRITING);

    @OneToMany(mappedBy = "brainwritingRoom")
    private Set<Idea> ideas;


    public BrainwritingRoom(){
        super();
    }
}
