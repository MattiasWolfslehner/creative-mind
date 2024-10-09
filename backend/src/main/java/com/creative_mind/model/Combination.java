package com.creative_mind.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Set;

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

    @ManyToOne
    @JoinColumn(name = "member_id")
    private User member;

    @ManyToMany
    @JoinTable(
            name = "combination_realization",
            joinColumns = @JoinColumn(name = "combination_id", referencedColumnName = "combination_id"),
            inverseJoinColumns = @JoinColumn(name = "content_id", referencedColumnName = "content_id"))
    @JsonIgnore
    private Set<Realization> realizationSet;

    public Combination(MorphologicalRoom morphologicalRoom, User member, Set<Realization> realizationSet) {
        this.morphologicalRoom = morphologicalRoom;
        this.member = member;
        this.realizationSet = realizationSet;
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

    public Set<Realization> getRealizationSet() {
        return realizationSet;
    }

    public void setRealizationSet(Set<Realization> realizationSet) {
        this.realizationSet = realizationSet;
    }
}

