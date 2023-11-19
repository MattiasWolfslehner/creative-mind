package com.creative_mind.model;

import jakarta.persistence.*;
import jakarta.websocket.Session;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "member")
@NamedQueries(
        {
                @NamedQuery(
                        name = User.GET_USER_BY_USER_ID,
                        query = "select u from User u where u.userId = :userId"
                )
        }
)
public class User {
    public static final String GET_USER_BY_USER_ID = "Participation.getUserByUserId";

    @Id
    @GeneratedValue
    private Integer id;
    private UUID userId;
    @Transient
    private Session session;
    @OneToMany(mappedBy = "member")
    Set<Participation> participations;

    public User() {
        this.userId = UUID.randomUUID();
    }

    public UUID getUserId() {
        return userId;
    }

    public Integer getId() {
        return id;
    }

    public void setSession(Session session) {
        this.session = session;
    }



}
