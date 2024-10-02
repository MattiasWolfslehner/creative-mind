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
        @JsonSubTypes.Type(value = BrainstormingRoom.class,name = "brainstormingroom"),
        @JsonSubTypes.Type(value = MorphologicalRoom.class,name = "morphologicalroom")
})
@NamedQuery(name = Room.GET_ROOM_BY_ROOM_ID, query = "select r from Room r where r.roomId = :roomId")
@NamedQuery(name = Room.GET_ALL_ROOMS, query = "select r from Room r")
public abstract class Room {
    public static final String GET_ROOM_BY_ROOM_ID = "Participation.getRoomByRoomId";
    public static final String GET_ALL_ROOMS = "Participation.getAllRooms";
    @OneToMany(mappedBy = "room")
    Set<Participation> participations;

    @JsonIgnore
    @Id
    @GeneratedValue
    private Integer id;
    @Enumerated(EnumType.STRING)
    private RoomStatus roomState;
    private UUID roomId;

    private String name;
    private String description;

    private UUID adminId;

    @JsonIgnore
    public abstract long getMaxTimerForRoom();
/*
    public Room(UUID adminIdToSet) {
        roomId = UUID.randomUUID();
        roomState = RoomStatus.CREATED;
        this.adminId = adminIdToSet;
    }
*/
    public Room() {
        roomId = UUID.randomUUID();
        roomState = RoomStatus.CREATED;
        this.adminId = null;
    }

    public UUID getRoomId() {
        return roomId;
    }
    public Integer getId() {
        return id;
    }
    public RoomStatus getRoomState() {
        return roomState;
    }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }

    public UUID getAdminId() {
        return adminId;
    }
    public void setAdminId(UUID adminId) {
        this.adminId = adminId;
    }

    public void setRoomState(RoomStatus started) {
        roomState = started;
    }

    public void setDescription(String description) {this.description = description;}
}

