package com.creative_mind.boundary.sockets;

import com.creative_mind.exception.CreativeMindException;
import com.creative_mind.manager.RoomManager;
import com.creative_mind.model.requests.ParticipantionRequest;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.persistence.NoResultException;
import jakarta.websocket.*;
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
            try {
                roomManager.removeParticipant(participantionRequest);
                Log.warn(String.format("Had to delete existing Session for room [%s] and user [%s]", parsedRoomId, parsedUserId));
            } catch (CreativeMindException | NoResultException e) {
                // ignore that it is not existent in this case
                Log.info(String.format("No existing Session for room [%s] and user [%s]", parsedRoomId, parsedUserId));
            }

            roomManager.addParticipantToRoom(participantionRequest);
            roomManager.addSessionToRoom(parsedRoomId, session, parsedUserId);
            Log.info(String.format("New Socket went well opened for room [%s] and user [%s]", parsedRoomId, parsedUserId));

        }, managedExecutor).exceptionally(throwable -> {
            Log.error(String.format("error in onOpen [%s]", throwable.toString()));
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
            roomManager.removeSessionFromRoom(parsedRoomId, sessionId, parsedUserId);

            Log.info(String.format("REMOVE Socket went well opened for room [%s] and user [%s]", parsedRoomId, parsedUserId));

        }, managedExecutor).exceptionally(throwable -> {
            throw new CompletionException(throwable);
        });
    }

    @OnError
    public void onError(Session session, @PathParam("roomId") String roomId, @PathParam("userId") String userId, Throwable t) {
        UUID parsedRoomId = UUID.fromString(roomId);
        UUID parsedUserId = UUID.fromString(userId);
        String sessionId = session.getId();

        Log.error(String.format("ERROR in socket for [%s] [%s]: [%s]", parsedRoomId, parsedUserId, t.toString()));

        ParticipantionRequest participantionRequest = new ParticipantionRequest(parsedRoomId, parsedUserId, sessionId);

        CompletableFuture.runAsync(() -> {

            roomManager.removeParticipant(participantionRequest);
            roomManager.removeSessionFromRoom(parsedRoomId, sessionId, parsedUserId);

            Log.info(String.format("REMOVE Socket went well opened for room [%s] and user [%s]", parsedRoomId, parsedUserId));

        }, managedExecutor).exceptionally(throwable -> {
            Log.error(String.format("ERROR in ERRORHANDLING for [%s] [%s]: [%s]", parsedRoomId, parsedUserId, throwable.toString()));

            throw new CompletionException(throwable);
        });
    }

}
