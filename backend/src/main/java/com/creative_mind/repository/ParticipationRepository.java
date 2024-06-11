package com.creative_mind.repository;

import com.creative_mind.exception.CreativeMindException;
import com.creative_mind.model.Participation;
import com.creative_mind.model.Room;
import com.creative_mind.model.User;
import com.creative_mind.model.requests.ParticipantionRequest;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;


@ApplicationScoped
public class ParticipationRepository {
    @Inject
    EntityManager entityManager;
    @Inject
    UserRepository userRepository;
    @Inject
    RoomRepository roomRepository;

    public List<Participation> getAllParticipation() {
        return this.entityManager.createNamedQuery(Participation.QUERY_FIND_ALL, Participation.class).getResultList();
    }
    public Participation getParticipation(Integer userId, Integer roomId ) {
        TypedQuery<Participation> query = entityManager.createNamedQuery(Participation.QUERY_FIND_ONE, Participation.class);
        Participation participation = query
                .setParameter("userId", userId)
                .setParameter("roomId", roomId)
                .getSingleResult();

        return participation;
    }

    public List<Participation> getParticipationForRoom(UUID roomId ) {
        TypedQuery<Participation> query = entityManager.createNamedQuery(Participation.QUERY_FIND_ONE_ROOM, Participation.class);
        List<Participation> participations = query
                .setParameter("roomId", roomId)
                .getResultList();

        return participations;
    }

    @Transactional
    public void addParticipation(ParticipantionRequest participationRequest) {
        String sessionId = participationRequest.getSessionId();

        User member = userRepository.getUserByUUID(participationRequest.getMemberId());
        Room room = roomRepository.getRoomByUUID(participationRequest.getRoomId());

        Log.info(String.format("try new Participation for user [%s] in room [%s]", member.getId(), room.getId()));
        Participation participation = new Participation(room, member, sessionId);

        if (!this.isUserInRoom(member.getId(), room.getId())) {
            Log.info(String.format("user [%s] added to room [%s]", member.getId(), room.getId()));
            this.entityManager.persist(participation);
        } else {
            throw new CreativeMindException(String.format("User[%s] is already in Room[%s]!", member.getId(), room.getId()));
        }
    }

    @Transactional
    public void removeParticipation(ParticipantionRequest participationRequest) {
        String sessionId = participationRequest.getSessionId();

        User member = userRepository.getUserByUUID(participationRequest.getMemberId());
        Room room = roomRepository.getRoomByUUID(participationRequest.getRoomId());

        Participation participation = getParticipation(member.getId(), room.getId());

        if (participation != null) {
            //Participation p = this.entityManager.merge(participation); // recommended with persistance
            this.entityManager.remove(participation);
        } else {
            Log.error(String.format("could not delete participation User[%s] in Room[%s] ([%s])!", member.getId(), room.getId(), sessionId));
            throw new CreativeMindException(String.format("User[%s] is not in Room[%s]!", member.getId(), room.getId()));
        }
    }

    public boolean isUserInRoom(Integer userId, Integer roomId) {
        TypedQuery<Long> query = entityManager.createNamedQuery(Participation.COUNT_USER_IN_ROOM, Long.class);

        Long count = query
                .setParameter("userId", userId)
                .setParameter("roomId", roomId)
                .getSingleResult();

        return count > 0;
    }

    public Integer countUsersInRoom(UUID roomId){
        TypedQuery<Long> query = entityManager.createNamedQuery(Participation.COUNT_USERS_BY_ROOM, Long.class);
        return query
                .setParameter("roomId", roomId)
                .getSingleResult()
                .intValue();
    }

}
