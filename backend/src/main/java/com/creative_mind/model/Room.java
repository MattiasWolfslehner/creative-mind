package com.creative_mind.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;

import java.util.Set;
import java.util.UUID;

import static jakarta.persistence.InheritanceType.SINGLE_TABLE;

@Entity
@Table(name ="room")
@Inheritance(strategy=SINGLE_TABLE)
@DiscriminatorColumn(discriminatorType = DiscriminatorType.STRING,
        name = "room_type")
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = BrainwritingRoom.class, name = "brainwritingroom"),
})
@NamedQueries(
    {
            @NamedQuery(
                    name = Room.GET_ROOM_BY_ROOM_ID,
                    query = "select r from Room r where r.roomId = :roomId"
            )
    }
)
public abstract class Room {

    public static final String GET_ROOM_BY_ROOM_ID = "Participation.getRoomByRoomId";

    @Id
    @GeneratedValue
    private Integer id;

    private UUID roomId;

    @OneToMany(mappedBy = "room")
    Set<Participation> participations;


    public Room() {
        roomId = UUID.randomUUID();
    }

    public UUID getRoomId() {
        return roomId;
    }

    public Integer getId() {
        return id;
    }
}