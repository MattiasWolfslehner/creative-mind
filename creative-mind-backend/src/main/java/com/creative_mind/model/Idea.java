package com.creative_mind.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

public class Idea {

    private int id = 0;
    static int instanceCounter = 0;
    private String content;

    public Idea() {
        this.id = instanceCounter++;
    }

    public int getId() {
        return id;
    }

    public String getContent() {
        return content;
    }
}
