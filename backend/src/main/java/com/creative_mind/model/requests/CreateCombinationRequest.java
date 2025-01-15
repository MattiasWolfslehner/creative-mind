package com.creative_mind.model.requests;

import java.util.Set;
import java.util.UUID;

public class CreateCombinationRequest {
    private UUID morphologicalRoomId;
    private UUID memberId;

    private String combinationText;

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

    public String getCombinationText() {
        return combinationText;
    }

    public void setCombinationText(String combinationText) {
        this.combinationText = combinationText;
    }
}
