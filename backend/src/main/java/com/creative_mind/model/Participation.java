package com.creative_mind.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "participation")

@NamedQuery(name = Participation.QUERY_FIND_ALL, query = "SELECT p FROM Participation p order by p.id")
@NamedQuery(name = Participation.COUNT_USER_IN_ROOM, query = "select count(p) from Participation p where p.member.id = :userId and p.room.id = :roomId")
@NamedQuery(name = Participation.COUNT_USERS_BY_ROOM, query = "select count(p.id) from Participation p where p.room.roomId = :roomId")
@NamedQuery(name = Participation.DELETE_PARTICIPATION, query = "delete from Participation p where p.member.id = :userId and p.room.id = :roomId and p.sessionId = :sessionId")
public class Participation {
    public static final String COUNT_USER_IN_ROOM = "Participation.countUserInRoom";
    public static final String DELETE_PARTICIPATION = "Participation.deleteParticipation";
    public static final String QUERY_FIND_ALL = "Participation.findAll";
    public static final String COUNT_USERS_BY_ROOM = "Participation.getCountByRoomId";


    @JsonIgnore
    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "member_id")
    // name must be the same mappedBy = "member" => Member member
    private User member;

    private String sessionId;

    public Participation(Room room, User user) {
        this.setRoom(room);
        this.setMember(user);
    }
    public Participation(Room room, User user, String sessionId) {
        this.setRoom(room);
        this.setMember(user);
        this.sessionId = sessionId;
    }

    public Participation() {
    }

    public Integer getId() {
        return id;
    }

    public Room getRoom() {
        return room;
    }

    private void setRoom(Room room) {
        this.room = room;
    }

    public User getMember() {
        return member;
    }

    public String getSessionId() {
        return sessionId;
    }

    private void setMember(User member) {
        this.member = member;
    }
}
