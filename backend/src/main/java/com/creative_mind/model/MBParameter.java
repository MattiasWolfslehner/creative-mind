package com.creative_mind.model;

import jakarta.persistence.*;

import java.util.Set;
import java.util.UUID;

@Entity
@NamedQuery(name = MBParameter.FIND_PARAMETER_BY_ROOM, query = "select p from MBParameter p where p.morphologicalRoom.roomId = :roomId")
@NamedQuery(name = MBParameter.FIND_PARAMETER_BY_PARAMID, query = "select p from MBParameter p where p.paramId = :paramId")
@NamedQuery(name = MBParameter.FIND_ROOM_BY_PARAMID, query = "select p.morphologicalRoom.roomId from MBParameter p where p.paramId = :paramId")

public class MBParameter {

    public static final String FIND_PARAMETER_BY_ROOM = "MBParameter.findByRoom";
    public static final String FIND_PARAMETER_BY_PARAMID = "MBParameter.findByParamId";
    public static final String FIND_ROOM_BY_PARAMID = "MBParameter.findRoomByParamId";

    @Id
    @GeneratedValue
    private int paramId;

    private String title;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private MorphologicalRoom morphologicalRoom;

    @OneToMany(mappedBy = "mbParameter", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Realization> realizations;

    public MBParameter(String title, MorphologicalRoom morphologicalRoom, Set<Realization> realizations) {
        this.title = title;
        this.morphologicalRoom = morphologicalRoom;
        this.realizations = realizations;
    }

    public MBParameter(String title, MorphologicalRoom morphologicalRoom) {
        this.title = title;
        this.morphologicalRoom = morphologicalRoom;
    }

    public MBParameter() {

    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getParamId() {
        return paramId;
    }

    public Set<Realization> getRealizations() {
        return realizations;
    }
}
