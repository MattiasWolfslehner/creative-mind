package com.creative_mind.boundary.sockets;


import com.creative_mind.model.requests.ParticipantionRequest;
import com.creative_mind.repository.ParticipationRepository;
import jakarta.inject.Inject;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.util.UUID;

@ServerEndpoint(value = "/rooms/join")
public class RoomSocket {

    @Inject
    ParticipationRepository participationRepository;

    @OnOpen
    public void onOpen(Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {

        UUID parsedRoomId = UUID.fromString(roomId);
        UUID parsedUserId = UUID.fromString(roomId);

        ParticipantionRequest participationRequest = new ParticipantionRequest(parsedRoomId, parsedUserId);

        participationRepository.addParticipation(participationRequest);

        System.out.println("Connected to room successfully");
    }

    @OnClose
    public void onClose(Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {
        UUID parsedRoomId = UUID.fromString(roomId);
        UUID parsedUserId = UUID.fromString(roomId);

        ParticipantionRequest participationRequest = new ParticipantionRequest(parsedRoomId, parsedUserId);

        System.out.println("closed");
        participationRepository.removeParticipation(participationRequest);
    }

    @OnError
    public void onError(Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId, Throwable throwable) {

    }

    @OnMessage
    public void onMessage(String message, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {
        System.out.println(message);
    }

    private void broadcast(String message) {

    }
}
