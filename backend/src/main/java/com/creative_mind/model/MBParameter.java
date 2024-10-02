package com.creative_mind.model;

import jakarta.persistence.*;

import java.util.Set;

@Entity
public class MBParameter {

    @Id
    @GeneratedValue
    private int paramId;

    private String title;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private MorphologicalRoom morphologicalRoom;

    @OneToMany(mappedBy = "mbParameter", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Realization> realizations;


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
