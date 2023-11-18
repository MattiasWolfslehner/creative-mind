package com.creative_mind.model;

import jakarta.persistence.*;

@Entity
public class Idea {
    @Id
    @GeneratedValue
    private int id;
    @Column(name="content")
    private String content;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private BrainwritingRoom brainwritingRoom;

    public Idea() {

    }

    public int getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

}
