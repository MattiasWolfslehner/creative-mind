package com.creative_mind.model;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@DiscriminatorValue("Brainwriting Room")
@NamedQueries(
        {
                @NamedQuery(
                        name = BrainwritingRoom.GET_BRAINWRITING_ROOM_BY_ROOM_ID,
                        query = "select r from BrainwritingRoom r where r.roomId = :roomId"
                )
        }
)
public class BrainwritingRoom extends Room {

    public static final String GET_BRAINWRITING_ROOM_BY_ROOM_ID = "Participation.getBrainWritingRoomByRoomId";
    private static final String ROOM_TYPE = String.valueOf(RoomType.BRAINWRITING);

    @OneToMany(mappedBy = "brainwritingRoom")
    private Set<Idea> ideas;


    public BrainwritingRoom(){
        super();
    }
}
