package com.creative_mind.manager;
import com.creative_mind.exception.CreativeMindException;
import com.creative_mind.model.Participation;
import com.creative_mind.model.requests.ParticipantionRequest;
import com.creative_mind.repository.ParticipationRepository;
import com.creative_mind.repository.RoomRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.websocket.Session;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class RoomManager {
    @Inject
    ParticipationRepository participationRepository;
    private Map<UUID, Set<Session>> roomSessions = new ConcurrentHashMap<>();

    public void removeParticipant(ParticipantionRequest participantionRequest){
        this.participationRepository.removeParticipation(participantionRequest);
    }

    public void addParticipantToRoom(ParticipantionRequest participantionRequest){
        this.participationRepository.addParticipation(participantionRequest);
    }

    public void addSessionToRoom(UUID roomId, Session session){
        try{
            roomSessions.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);
            this.broadcastMessageToRoom(roomId, String.format("%s joined the Room!", session.getId()));
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
            this.broadcastMessageToRoom(roomId, String.format("%s left the Room!", sessionId));
        }catch (Exception e){
            throw new CreativeMindException("Session is not available!",e);
        }
    }

    public void broadcastMessageToRoom(UUID roomId, String message) {
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
