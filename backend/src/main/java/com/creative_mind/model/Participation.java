package com.creative_mind.model;

import jakarta.persistence.*;

@Entity
@Table(name = "participation")
@NamedQueries({
        @NamedQuery(name = Participation.QUERY_FIND_ALL, query = "SELECT p FROM Participation p order by p.id"),
        @NamedQuery(
                name = Participation.COUNT_USER_IN_ROOM,
                query = "select count(p) from Participation p where p.member.id = :userId and p.room.id = :roomId"
        ),
        @NamedQuery(
                name = Participation.DELETE_PARTICIPATION,
                query = "delete from Participation p where p.member.userId = :userId and p.room.roomId = :roomId"
        )
})
public class Participation {
    public static final String COUNT_USER_IN_ROOM = "Participation.countUserInRoom";
    public static final String DELETE_PARTICIPATION = "Participation.deleteParticipation";
    public static final String QUERY_FIND_ALL = "Grade.findAll";

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

    public Participation(Room room, User user) {
        this.setRoom(room);
        this.setMember(user);
    }

    public Participation() {

    }

    public Integer getId() {
        return id;
    }
    public Room getRoom() {
        return room;
    }
    public User getMember() {
        return member;
    }
    private void setRoom(Room room) {
        this.room = room;
    }
    private void setMember(User member) {
        this.member = member;
    }
}
