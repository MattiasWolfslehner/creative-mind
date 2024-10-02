package com.creative_mind.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.Set;

@Entity
@DiscriminatorValue("Morphological Room")
public class MorphologicalRoom extends Room{
    private static final String ROOM_TYPE = String.valueOf(RoomType.MORPHOLOGICAL);

    @Override
    public long getMaxTimerForRoom() {
        return 0;
    }

    @OneToMany(mappedBy = "morphologicalRoom")
    private Set<MBParameter> parameters;
}
