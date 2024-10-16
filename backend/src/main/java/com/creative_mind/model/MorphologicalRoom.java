package com.creative_mind.model;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@DiscriminatorValue("Morphological Room")
@NamedQuery(name = MorphologicalRoom.GET_ROOM_BY_ROOM_ID, query = "select r from MorphologicalRoom r where r.roomId = :roomId")
public class MorphologicalRoom extends Room {
    public static final String GET_ROOM_BY_ROOM_ID = "MorphologicalRoom.getRoomByRoomId";
    public MorphologicalRoom() {super();}

    private static final String ROOM_TYPE = String.valueOf(RoomType.MORPHOLOGICAL);

    @Override
    public long getMaxTimerForRoom() {
        return 0;
    }

    @OneToMany(mappedBy = "morphologicalRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MBParameter> parameters;

    @OneToMany(mappedBy = "morphologicalRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Combination> combinations;

}
