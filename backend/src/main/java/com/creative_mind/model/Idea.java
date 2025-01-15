package com.creative_mind.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@NamedQuery(name = Idea.FIND_IDEA_BY_ROOM, query = "select i from Idea i where i.ideaRoom.roomId = :roomId")
public class Idea {
    public static final String FIND_IDEA_BY_ROOM = "Ideas.findByRoom";

    @JsonIgnore
    @Id
    @GeneratedValue
    private int id;
    @Column(name = "content")
    private String content;
    @ManyToOne
    @JoinColumn(name = "room_id")
    private IdeaRoom ideaRoom;
    @ManyToOne
    @JoinColumn(name = "member_id")
    private User member;

    public Idea(String content, IdeaRoom ideaRoom, User member) {
        this.content = content;
        this.ideaRoom = ideaRoom;
        this.member = member;
    }
    public Idea() {}


    public UUID getMemberId() {
        return member.getUserId();
    }

    public int getId() {
        return id;
    }
    public String getContent() {
        return content;
    }
}
