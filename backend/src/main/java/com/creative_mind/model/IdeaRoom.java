package com.creative_mind.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;

import java.util.Set;

@Entity
@NamedQuery(name = BrainwritingRoom.GET_IDEA_ROOM_BY_ROOM_ID, query = "select r from IdeaRoom r where r.roomId = :roomId")
public abstract class IdeaRoom extends Room{

    public static final String GET_IDEA_ROOM_BY_ROOM_ID = "Participation.getBrainWritingRoomByRoomId";
    @OneToMany(mappedBy = "ideaRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Idea> ideas;

    public IdeaRoom() {
        super();
    }
}
