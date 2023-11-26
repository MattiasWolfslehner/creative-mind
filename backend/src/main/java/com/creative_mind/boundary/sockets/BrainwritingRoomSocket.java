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

    @Inject
    ParticipationRepository participationRepository;
    @Inject
    IdeaRepository ideaRepository;

    @OnOpen
    public void onOpen(Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {

        UUID parsedRoomId = UUID.fromString(roomId);
        UUID parsedUserId = UUID.fromString(userId);
        String sessionId = session.getId();

        ParticipantionRequest participantionRequest = new ParticipantionRequest(parsedRoomId, parsedUserId, sessionId);

        CompletableFuture.runAsync(() -> {

            participationRepository.addParticipation(participantionRequest);
            participationRepository.addSessionToRoom(parsedRoomId, session);

        }).exceptionally(throwable -> {
            throwable.printStackTrace();
            return null;
        });
    }

    @OnClose
    public void onClose(Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {
        UUID parsedRoomId = UUID.fromString(roomId);
        UUID parsedUserId = UUID.fromString(userId);
        String sessionId = session.getId();

        ParticipantionRequest participantionRequest = new ParticipantionRequest(parsedRoomId, parsedUserId, sessionId);

        CompletableFuture.runAsync(() -> {
            participationRepository.removeParticipation(participantionRequest);
        }).exceptionally(throwable -> {
            throwable.printStackTrace();
            return null;
        });
    }
}