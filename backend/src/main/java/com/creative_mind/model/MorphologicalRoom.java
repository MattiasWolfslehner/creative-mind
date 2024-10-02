package com.creative_mind.model;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@DiscriminatorValue("Morphological Room")
public class MorphologicalRoom extends Room{
    private static final String ROOM_TYPE = String.valueOf(RoomType.MORPHOLOGICAL);
    @Override
    public long getMaxTimerForRoom() {
        return 0;
    }

    @OneToMany(mappedBy = "morphologicalRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MBParameter> parameters;
}
