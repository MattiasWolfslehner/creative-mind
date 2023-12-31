package com.creative_mind.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;

import java.util.Set;
import java.util.UUID;

import static jakarta.persistence.InheritanceType.SINGLE_TABLE;

@Entity
@Table(name = "room")
@Inheritance(strategy = SINGLE_TABLE)
@DiscriminatorColumn(discriminatorType = DiscriminatorType.STRING,
        name = "room_type")
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = BrainwritingRoom.class, name = "brainwritingroom"),
})
@NamedQuery(name = Room.GET_ROOM_BY_ROOM_ID, query = "select r from Room r where r.roomId = :roomId")
@NamedQuery(name = Room.GET_ALL_ROOMS, query = "select r from Room r")
public abstract class Room {
    public static final String GET_ROOM_BY_ROOM_ID = "Participation.getRoomByRoomId";
    public static final String GET_ALL_ROOMS = "Participation.getAllRooms";
    @OneToMany(mappedBy = "room")
    Set<Participation> participations;
    @OneToMany(mappedBy = "brainwritingRoom")
    Set<Idea> ideas;
    @JsonIgnore
    @Id
    @GeneratedValue
    private Integer id;
    private boolean roomState;
    private UUID roomId;

    public Room() {
        roomId = UUID.randomUUID();
    }
    public UUID getRoomId() {
        return roomId;
    }
    public Integer getId() {
        return id;
    }
    public boolean getRoomState() {
        return roomState;
    }

    public void setRoomState(boolean started) {
        roomState = started;
    }
}

