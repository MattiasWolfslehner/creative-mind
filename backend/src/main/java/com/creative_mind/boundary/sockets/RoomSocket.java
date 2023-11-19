package com.creative_mind.boundary.sockets;

import com.creative_mind.model.requests.ParticipantionRequest;
import com.creative_mind.repository.ParticipationRepository;
import jakarta.inject.Inject;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/rooms/join/{roomId}/{userId}")
public class RoomSocket {

    @Inject
    ParticipationRepository participationRepository;

    private static Map<UUID, Set<Session>> roomSessions = new ConcurrentHashMap<>();

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

            broadcastToRoom(roomId, String.format("%s joined the room!", userId));
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

            broadcastToRoom(roomId, String.format("%s left the room!", userId));
        }).exceptionally(throwable -> {
            throwable.printStackTrace();
            return null;
        });
    }

    @OnMessage
    public void onMessage(String message, Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {
        broadcastToRoom(roomId, String.format("%s: %s", userId, message));
    }

    private void broadcastToRoom(String roomId, String message) {
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
