package com.creative_mind.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Set;

@NamedQuery(name = Realization.RETURN_REALIZATION_SET, query = "SELECT r FROM Realization r WHERE r.contentId IN :ids")
@Entity
public class Realization {

    public static final String RETURN_REALIZATION_SET = "Realization.returnRealizationSet";

    @Id
    @GeneratedValue
    @Column(name = "content_id")
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

