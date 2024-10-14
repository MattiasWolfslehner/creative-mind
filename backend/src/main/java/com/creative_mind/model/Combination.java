package com.creative_mind.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Combination {

    @JsonIgnore
    @Id
    @GeneratedValue
    @Column(name = "combination_id")
    private int combinationId;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private MorphologicalRoom morphologicalRoom;

    private String combinationText;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private User member;

    public Combination(MorphologicalRoom morphologicalRoom, String combinationText, User member) {
        this.morphologicalRoom = morphologicalRoom;
        this.combinationText = combinationText;
        this.member = member;
    }

    public Combination() {
    }

    public MorphologicalRoom getMorphologicalRoom() {
        return morphologicalRoom;
    }

    public void setMorphologicalRoom(MorphologicalRoom morphologicalRoom) {
        this.morphologicalRoom = morphologicalRoom;
    }

    public User getMember() {
        return member;
    }

    public void setMember(User member) {
        this.member = member;
    }

    public String getCombinationText() {
        return combinationText;
    }

    public void setCombinationText(String combinationText) {
        this.combinationText = combinationText;
    }
}

