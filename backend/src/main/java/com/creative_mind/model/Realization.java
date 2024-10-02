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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

