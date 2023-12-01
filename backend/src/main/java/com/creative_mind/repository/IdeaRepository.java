package com.creative_mind.repository;

import com.creative_mind.model.BrainwritingRoom;
import com.creative_mind.model.Idea;
import com.creative_mind.model.User;
import com.creative_mind.model.requests.IdeaRequest;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class IdeaRepository {
    @Inject
    EntityManager entityManager;
    @Inject
    UserRepository userRepository;


    @Transactional
    public Idea addIdea(IdeaRequest ideaRequest) {

        TypedQuery<BrainwritingRoom> roomQuery = this.entityManager
                .createNamedQuery(BrainwritingRoom.GET_BRAINWRITING_ROOM_BY_ROOM_ID, BrainwritingRoom.class);
        roomQuery.setParameter("roomId", ideaRequest.getRoomId());

        User member = userRepository.getUserByUUID(ideaRequest.getMemberId());
        BrainwritingRoom room = roomQuery.getSingleResult();

        Idea idea = new Idea(ideaRequest.getContent(), room, member);

        this.entityManager.persist(idea);
        return idea;
    }

    public List<Idea> findByRoomId(UUID roomId) {

        TypedQuery<Idea> query = this.entityManager.createNamedQuery(Idea.FIND_IDEA_BY_ROOM, Idea.class);

        query.setParameter("roomId", roomId);

        return query.getResultList();
    }
}