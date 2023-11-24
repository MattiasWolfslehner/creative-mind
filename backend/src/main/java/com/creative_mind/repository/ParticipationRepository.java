package com.creative_mind.repository;

import com.creative_mind.exception.CreativeMindException;
import com.creative_mind.model.Participation;
import com.creative_mind.model.Room;
import com.creative_mind.model.User;
import com.creative_mind.model.requests.ParticipantionRequest;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ParticipationRepository {
    @Inject
    EntityManager entityManager;


    public List<Participation> getAllParticipation() {
        return this.entityManager.createNamedQuery(Participation.QUERY_FIND_ALL, Participation.class).getResultList();
    }

    @Transactional
    public void addParticipation(ParticipantionRequest participationRequest) {
        UUID userId = participationRequest.getMemberId();
        UUID roomId = participationRequest.getRoomId();

        TypedQuery<User> userQuery = this.entityManager
                .createNamedQuery(User.GET_USER_BY_USER_ID, User.class);
        userQuery.setParameter("userId", userId);

        TypedQuery<Room> roomQuery = this.entityManager
                .createNamedQuery(Room.GET_ROOM_BY_ROOM_ID, Room.class);
        roomQuery.setParameter("roomId", roomId);

        User member = userQuery.getSingleResult();
        Room room = roomQuery.getSingleResult();

        Participation participation = new Participation(room, member);

        if (!this.isUserInRoom(member.getId(), room.getId())) {
            this.entityManager.persist(participation);
        } else {
            throw new CreativeMindException(String.format("User[%s] is already in Room[%s]!", userId, roomId));
        }
    }

    @Transactional
    public void removeParticipation(ParticipantionRequest participationRequest) {
        UUID userId = participationRequest.getMemberId();
        UUID roomId = participationRequest.getRoomId();

        TypedQuery<User> userQuery = this.entityManager
                .createNamedQuery(User.GET_USER_BY_USER_ID, User.class);
        userQuery.setParameter("userId", userId);

        TypedQuery<Room> roomQuery = this.entityManager
                .createNamedQuery(Room.GET_ROOM_BY_ROOM_ID, Room.class);
        roomQuery.setParameter("roomId", roomId);

        User member = userQuery.getSingleResult();
        Room room = roomQuery.getSingleResult();

        Participation participation = new Participation(room, member);

        if (this.isUserInRoom(member.getId(), room.getId())) {
            Query participationQuery = this.entityManager
                    .createNamedQuery(Participation.DELETE_PARTICIPATION);

            participationQuery.setParameter("roomId", participation.getRoom().getRoomId());
            participationQuery.setParameter("userId", participation.getMember().getUserId());

            int isSuccess = participationQuery.executeUpdate();
        } else {
            throw new CreativeMindException(String.format("User[%s] is not in Room[%s]!", userId, roomId));
        }
    }


    public boolean isUserInRoom(Integer userId, Integer roomId) {
        TypedQuery<Long> query = entityManager.createNamedQuery("Participation.countUserInRoom", Long.class);

        Long count = query
                .setParameter("userId", userId)
                .setParameter("roomId", roomId)
                .getSingleResult();

        return count > 0;
    }
}
