package com.creative_mind.boundary.sockets;

import com.creative_mind.manager.RoomManager;
import com.creative_mind.model.requests.ParticipantionRequest;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.eclipse.microprofile.context.ManagedExecutor;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

@ServerEndpoint("/rooms/join/{roomId}/{userId}")
public class BrainwritingRoomSocket {

    @Inject
    RoomManager roomManager;

    @Inject
    ManagedExecutor managedExecutor;

    @OnOpen
    public void onOpen(Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {

        Log.info("Socket OPENED");

        UUID parsedRoomId = UUID.fromString(roomId);
        UUID parsedUserId = UUID.fromString(userId);
        String sessionId = session.getId();

        ParticipantionRequest participantionRequest = new ParticipantionRequest(parsedRoomId, parsedUserId, sessionId);

        CompletableFuture.runAsync(() -> {
            roomManager.addParticipantToRoom(participantionRequest);
            roomManager.addSessionToRoom(parsedRoomId, session);
            Log.info(String.format("New Socket went well opened for room [%s] and user [%s]", parsedRoomId, parsedUserId));

        }, managedExecutor).exceptionally(throwable -> {
            throw new CompletionException(throwable);
        });
    }

    @OnMessage
    public void onMessage(String content, Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId) {
        CompletableFuture.runAsync(() -> {
                Log.error(String.format("Got Message from Socket: [%s]", content));
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

            Log.info(String.format("REMOVE Socket went well opened for room [%s] and user [%s]", parsedRoomId, parsedUserId));

        }, managedExecutor).exceptionally(throwable -> {
            throw new CompletionException(throwable);
        });
    }
}
