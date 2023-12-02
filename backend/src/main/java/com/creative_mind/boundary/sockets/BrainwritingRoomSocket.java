package com.creative_mind.boundary.sockets;

import com.creative_mind.manager.RoomManager;
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
import org.eclipse.microprofile.context.ManagedExecutor;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/rooms/join/{roomId}/{userId}")
public class BrainwritingRoomSocket {

    @Inject
    RoomManager roomManager;

    @Inject
    ManagedExecutor managedExecutor;

    @OnOpen
    public void onOpen(Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {

        UUID parsedRoomId = UUID.fromString(roomId);
        UUID parsedUserId = UUID.fromString(userId);
        String sessionId = session.getId();

        ParticipantionRequest participantionRequest = new ParticipantionRequest(parsedRoomId, parsedUserId, sessionId);

        CompletableFuture.runAsync(() -> {

            roomManager.addParticipantToRoom(participantionRequest);
            roomManager.addSessionToRoom(parsedRoomId, session);

        }, managedExecutor).exceptionally(throwable -> {
            throw new CompletionException(throwable);
        });
    }

    @OnMessage
    public void onMessage(String content, Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {
        CompletableFuture.runAsync(() -> {


        }, managedExecutor).exceptionally(throwable -> {
            throw new CompletionException(throwable);
        });
    }

    @OnClose
    public void onClose(Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {
        UUID parsedRoomId = UUID.fromString(roomId);
        UUID parsedUserId = UUID.fromString(userId);
        String sessionId = session.getId();

        ParticipantionRequest participantionRequest = new ParticipantionRequest(parsedRoomId, parsedUserId, sessionId);

        CompletableFuture.runAsync(() -> {

            roomManager.removeParticipant(participantionRequest);
            roomManager.removeSessionFromRoom(parsedRoomId, sessionId);

        }, managedExecutor).exceptionally(throwable -> {
            throw new CompletionException(throwable);
        });
    }
}
