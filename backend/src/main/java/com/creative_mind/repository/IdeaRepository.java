package com.creative_mind.repository;

import com.creative_mind.exception.CreativeMindException;
import com.creative_mind.model.*;
import com.creative_mind.model.requests.IdeaRequest;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.*;

@ApplicationScoped
public class IdeaRepository {
    @Inject
    EntityManager entityManager;

    @Transactional
    public Idea addIdea(IdeaRequest ideaRequest){
        UUID userId = ideaRequest.getMemberId();
        UUID roomId = ideaRequest.getRoomId();

        TypedQuery<User> userQuery = this.entityManager
                .createNamedQuery(User.GET_USER_BY_USER_ID, User.class);
        userQuery.setParameter("userId", userId);

        TypedQuery<BrainwritingRoom> roomQuery = this.entityManager
                .createNamedQuery(BrainwritingRoom.GET_BRAINWRITING_ROOM_BY_ROOM_ID, BrainwritingRoom.class);
        roomQuery.setParameter("roomId", roomId);

        User member = userQuery.getSingleResult();
        BrainwritingRoom room = roomQuery.getSingleResult();

        Idea idea = new Idea(ideaRequest.getContent(), room, member);

        this.entityManager.persist(idea);

        return idea;
    }

    public List<Idea> findByRoomId(UUID roomId){

        TypedQuery<Idea> query = this.entityManager.createNamedQuery(Idea.FIND_IDEA_BY_ROOM,Idea.class);

        query.setParameter("roomId", roomId);

        return query.getResultList();
    }



}