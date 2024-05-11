package com.creative_mind.manager;

import com.creative_mind.exception.CreativeMindException;
import com.creative_mind.model.Room;
import com.creative_mind.model.requests.ParticipantionRequest;
import com.creative_mind.repository.ParticipationRepository;
import com.creative_mind.repository.RoomRepository;
import io.quarkus.logging.Log;
import io.vertx.core.Vertx;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.websocket.Session;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class RoomManager {

    @Inject
    Vertx vertx;
    @Inject
    ParticipationRepository participationRepository;
    @Inject
    RoomRepository roomRepository;
    private Map<UUID, Set<Session>> roomSessions = new ConcurrentHashMap<>();
    private Map<UUID, Long> roomTimers = new ConcurrentHashMap<>();

    public void startRoom(UUID roomId) {

        Log.info(String.format("start room [%s]", roomId ));
        Room thisRoom = roomRepository.getRoomByUUID(roomId);
        // ToDo: Implement dynamic room-counters
        long delay = 1000L;
        long maxTime = thisRoom.getMaxTimerForRoom();

        if (!this.roomTimers.containsKey(roomId)) {
            Log.info(String.format("addTimers room [%s] ... maximum [%d]", roomId, maxTime ));
            long startTime = System.currentTimeMillis();

            long timerId = vertx.setPeriodic(delay, timer -> {
                long currentTime = System.currentTimeMillis();
                long elapsedTime = currentTime - startTime;
                long remainingTime = maxTime - elapsedTime;
                //Log.info(String.format("Timer fired room [%s]", roomId ));

                if (remainingTime >= 0) {
                    // Convert remaining time to seconds
                    long remainingSeconds = remainingTime / 1000;

                    try {
                        String jsonString = new JSONObject()
                                .put("response_type", "get_remaining_room_time")
                                .put("remaining", remainingSeconds)
                                .toString();

                        this.broadcastMessageToRoom(roomId, jsonString);
                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }

                } else {
                    vertx.cancelTimer(timer); // Stop the timer if maxTime is reached

                    this.stopRoom(roomId);

                }
            });

            this.roomTimers.put(roomId, timerId);

            try {
                String jsonString = new JSONObject()
                        .put("response_type", "room_started")
                        .put("message", String.format("Room [%s] has started!", roomId.toString()))
                        .put("roomId", roomId.toString())
                        .toString();

                this.broadcastMessageToRoom(roomId, jsonString);
            } catch (JSONException e) {
                throw new CreativeMindException(String.format("could not broadcast to room[%s] ([%s])!", roomId.toString(), e.toString()));
            }
        } else {
            throw new CreativeMindException(String.format("Timer for room[%s] is already running!", roomId.toString()));
        }
    }


    public void stopRoom(UUID roomId) {

        try {
            String jsonString = new JSONObject()
                    .put("response_type", "room_closed")
                    .put("message", String.format("Room [%s] has stopped!", roomId.toString()))
                    .put("roomId", roomId.toString())
                    .toString();

            Long timerId = roomTimers.remove(roomId);
            if (timerId != null) {
                vertx.cancelTimer(timerId);
            }
            this.broadcastMessageToRoom(roomId, jsonString);

            roomSessions.remove(roomId);

        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }


    public void removeParticipant(ParticipantionRequest participantionRequest){
        this.participationRepository.removeParticipation(participantionRequest);
    }

    public void addParticipantToRoom(ParticipantionRequest participantionRequest){
        this.participationRepository.addParticipation(participantionRequest);
    }

    public void addSessionToRoom(UUID roomId, Session session){
        try{

            String jsonString = new JSONObject()
                    .put("response_type", "room_notification")
                    .put("message", String.format("%s joined the Room!", session.getId()))
                    .toString();

            roomSessions.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);
            this.broadcastMessageToRoom(roomId, jsonString);


        }catch (Exception e){
            throw new CreativeMindException("Failed to add Session!", e);
        }
    }

    public void removeSessionFromRoom(UUID roomId, String sessionId){
        try{
            roomSessions.computeIfPresent(roomId, (k, v) -> {
                for (Session iterator : this.roomSessions.get(roomId)) {
                    if(iterator.getId().equals(sessionId)){
                        v.remove(iterator); // delete session from room
                        break;
                    }
                }
                return v.isEmpty() ? null : v; // delete room from list
            });
            String jsonString = new JSONObject()
                    .put("response_type", "room_notification")
                    .put("message", String.format("%s left the Room!", sessionId))
                    .toString();

            this.broadcastMessageToRoom(roomId, jsonString);

        }catch (Exception e){
            throw new CreativeMindException("Session is not available!",e);
        }
    }

    public void newsForAllSessions (UUID roomId){
        try{
            String jsonString = new JSONObject()
                    .put("response_type", "new_ideas_in_room")
                    .put("message", "there are new ideas in the Room!")
                    .toString();

            this.broadcastMessageToRoom(roomId, jsonString);

        }catch (Exception e){
            throw new CreativeMindException("Room is not available!",e);
        }
    }


    public void broadcastMessageToRoom(UUID roomId, String jsonObject) {
        Set<Session> sessions = roomSessions.get(roomId);
        if (sessions != null) {
            for (Session iterator : sessions) {
                iterator.getAsyncRemote().sendText(jsonObject, result -> {
                    if (result.getException() != null) {
                        System.out.println("Unable to send message: " + result.getException());
                    }
                });
            }
        }
    }
}
