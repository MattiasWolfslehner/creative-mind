package com.creative_mind.model.requests;

import java.util.UUID;

public class RealizationRequest {
    private String content;
    private int paramId;

    public RealizationRequest(String content, int paramId) {
        this.content = content;
        this.paramId = paramId;
    }

    public RealizationRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getParamId() {
        return paramId;
    }

    public void setParamId(int paramId) {
        this.paramId = paramId;
    }
}

