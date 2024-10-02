package com.creative_mind.model;

import jakarta.persistence.*;

@Entity
public class Realization {

    @Id
    @GeneratedValue
    private int contentId;

    private String content;

    @ManyToOne
    @JoinColumn(name = "param_id")
    private MBParameter mbParameter;

    public Realization(String content, MBParameter mbParameter) {
        this.content = content;
        this.mbParameter = mbParameter;
    }

    public Realization() {
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getContentId() {
        return contentId;
    }
}

