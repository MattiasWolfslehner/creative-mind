package com.creative_mind.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.websocket.Session;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "member")
@NamedQuery(name = User.GET_ALL_USERS, query = "select u from User u ")
@NamedQuery(name = User.GET_USER_BY_USER_ID, query = "select u from User u where u.userId = :userId")
public class User {
    public static final String GET_ALL_USERS = "Participation.getAllUsers";
    public static final String GET_USER_BY_USER_ID = "Participation.getUserByUserId";
    @OneToMany(mappedBy = "member")
    Set<Participation> participations;

    @OneToMany(mappedBy = "member")
    Set<Idea> ideas;

    @JsonIgnore
    @Id
    @GeneratedValue
    private Integer id;

    private UUID userId;

    public User(UUID uuid) {
        this.userId = uuid;
    }

    public User() {
    }

    public UUID getUserId() {
        return userId;
    }

    public Integer getId() {
        return id;
    }

}
