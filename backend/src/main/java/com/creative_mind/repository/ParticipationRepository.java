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
import jakarta.websocket.Session;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class ParticipationRepository {
    @Inject
    EntityManager entityManager;
    private Map<UUID, Set<Session>> roomSessions = new ConcurrentHashMap<>();

    public List<Participation> getAllParticipation() {
        return this.entityManager.createNamedQuery(Participation.QUERY_FIND_ALL, Participation.class).getResultList();
    }

    @Transactional
    public void addParticipation(ParticipantionRequest participationRequest) {
        UUID userId = participationRequest.getMemberId();
        UUID roomId = participationRequest.getRoomId();
        String sessionId = participationRequest.getSessionId();


        TypedQuery<User> userQuery = this.entityManager
                .createNamedQuery(User.GET_USER_BY_USER_ID, User.class);
        userQuery.setParameter("userId", userId);

        TypedQuery<Room> roomQuery = this.entityManager
                .createNamedQuery(Room.GET_ROOM_BY_ROOM_ID, Room.class);
        roomQuery.setParameter("roomId", roomId);

        User member = userQuery.getSingleResult();
        Room room = roomQuery.getSingleResult();

        Participation participation = new Participation(room, member, sessionId);

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
        String sessionId = participationRequest.getSessionId();

        TypedQuery<User> userQuery = this.entityManager
                .createNamedQuery(User.GET_USER_BY_USER_ID, User.class);
        userQuery.setParameter("userId", userId);

        TypedQuery<Room> roomQuery = this.entityManager
                .createNamedQuery(Room.GET_ROOM_BY_ROOM_ID, Room.class);
        roomQuery.setParameter("roomId", roomId);

        User member = userQuery.getSingleResult();
        Room room = roomQuery.getSingleResult();

        Participation participation = new Participation(room, member, sessionId);

        if (this.isUserInRoom(member.getId(), room.getId())) {
            Query participationQuery = this.entityManager
                    .createNamedQuery(Participation.DELETE_PARTICIPATION);

            participationQuery.setParameter("roomId", participation.getRoom().getRoomId());
            participationQuery.setParameter("userId", participation.getMember().getUserId());
            participationQuery.setParameter("sessionId", participation.getSessionId());

            int isSuccess = participationQuery.executeUpdate();

           this.removeSessionFromRoom(roomId, sessionId);
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

    // sessions
    public void addSessionToRoom(UUID roomId, Session session){
        try{
            roomSessions.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);
            this.broadcastMessage(roomId, String.format("%s joined the Room!", session.getId()));
        }catch (Exception e){
            throw new CreativeMindException("Failed to add Session!", e);
        }
    }

    public void removeSessionFromRoom(UUID roomId, String sessionId){
        try{
            roomSessions.computeIfPresent(roomId, (k, v) -> {
                for (Session iterator : this.roomSessions.get(roomId)) {
                    if(iterator.getId().equals(sessionId)){
                        v.remove(iterator);
                        break;
                    }
                }
                return v.isEmpty() ? null : v;
            });

            this.broadcastMessage(roomId, String.format("%s left the Room!", sessionId));
        }catch (Exception e){
            throw new CreativeMindException("Session is not available!",e);
        }
    }

    public void broadcastMessage(UUID roomId, String message) {
        Set<Session> sessions = roomSessions.get(roomId);
        if (sessions != null) {
            for (Session iterator : sessions) {
                iterator.getAsyncRemote().sendText(message, result -> {
                    if (result.getException() != null) {
                        System.out.println("Unable to send message: " + result.getException());
                    }
                });
            }
        }
    }
}
