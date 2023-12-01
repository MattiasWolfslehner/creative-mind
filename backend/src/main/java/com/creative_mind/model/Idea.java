package com.creative_mind.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@NamedQuery(name = Idea.FIND_IDEA_BY_ROOM, query = "select i from Idea i where i.brainwritingRoom.roomId = :roomId")
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
    private BrainwritingRoom brainwritingRoom;
    @ManyToOne
    @JoinColumn(name = "member_id")
    private User member;

    public Idea(String content, BrainwritingRoom brainwritingRoom, User member) {
        this.content = content;
        this.brainwritingRoom = brainwritingRoom;
        this.member = member;
    }
    public Idea() {}
    public int getId() {
        return id;
    }
    public String getContent() {
        return content;
    }
}
