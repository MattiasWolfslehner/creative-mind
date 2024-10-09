package com.creative_mind.model.requests;

import java.util.Set;
import java.util.UUID;

public class CreateCombinationRequest {
    private UUID morphologicalRoomId;
    private UUID memberId;
    private Set<Integer> realizationIds;

    // Getters and Setters
    public UUID getMorphologicalRoomId() {
        return morphologicalRoomId;
    }

    public void setMorphologicalRoomId(UUID morphologicalRoomId) {
        this.morphologicalRoomId = morphologicalRoomId;
    }

    public UUID getMemberId() {
        return memberId;
    }

    public void setMemberId(UUID memberId) {
        this.memberId = memberId;
    }

    public Set<Integer> getRealizationIds() {
        return realizationIds;
    }

    public void setRealizationIds(Set<Integer> realizationIds) {
        this.realizationIds = realizationIds;
    }
}
