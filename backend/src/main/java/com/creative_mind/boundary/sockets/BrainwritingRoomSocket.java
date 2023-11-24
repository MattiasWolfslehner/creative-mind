package com.creative_mind.boundary.sockets;

import com.creative_mind.model.Idea;
import com.creative_mind.model.requests.IdeaRequest;
import com.creative_mind.model.requests.ParticipantionRequest;
import com.creative_mind.repository.IdeaRepository;
import com.creative_mind.repository.ParticipationRepository;
import jakarta.enterprise.context.control.ActivateRequestContext;
import jakarta.inject.Inject;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/rooms/join/{roomId}/{userId}")
public class BrainwritingRoomSocket {

    private static final Map<UUID, Set<Session>> roomSessions = new ConcurrentHashMap<>();
    @Inject
    ParticipationRepository participationRepository;
    @Inject
    IdeaRepository ideaRepository;

    @OnOpen
    public void onOpen(Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {
        UUID parsedRoomId = UUID.fromString(roomId);
        UUID parsedUserId = UUID.fromString(userId);

        ParticipantionRequest participantionRequest = new ParticipantionRequest(parsedRoomId, parsedUserId);

        // Offload the blocking operation to a separate thread
        CompletableFuture.runAsync(() -> {
            // Keep track of the rooms in the database
            participationRepository.addParticipation(participantionRequest);

            // Store the session temporarily
            roomSessions.computeIfAbsent(parsedRoomId, k -> ConcurrentHashMap.newKeySet()).add(session);

            broadcastMessage(roomId, String.format("%s joined the Room!", userId));

        }).exceptionally(throwable -> {
            throwable.printStackTrace();
            return null;
        });
    }

    @OnClose
    public void onClose(Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {
        UUID parsedRoomId = UUID.fromString(roomId);
        UUID parsedUserId = UUID.fromString(userId);

        ParticipantionRequest participantionRequest = new ParticipantionRequest(parsedRoomId, parsedUserId);

        // Offload the blocking operation to a separate thread
        CompletableFuture.runAsync(() -> {
            participationRepository.removeParticipation(participantionRequest);

            // Remove the session from the roomSessions map
            roomSessions.computeIfPresent(parsedRoomId, (k, v) -> {
                v.remove(session);
                return v.isEmpty() ? null : v;
            });

            broadcastMessage(roomId, String.format("%s left the Room!", userId));
        }).exceptionally(throwable -> {
            throwable.printStackTrace();
            return null;
        });
    }

    private void broadcastMessage(String roomId, String message) {
        UUID parsedRoomId = UUID.fromString(roomId);

        // Get the sessions for the specified room
        Set<Session> sessions = roomSessions.get(parsedRoomId);
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
