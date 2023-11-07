package com.creative_mind.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

public class Idea {

    private int id = 0;
    private String content;

    public Idea() {}

    public int getId() {
        return id;
    }

    public void setId(int id){
        this.id = id;
    }

    public String getContent() {
        return content;
    }
}
