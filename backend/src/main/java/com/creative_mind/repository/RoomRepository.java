package com.creative_mind.repository;

import com.creative_mind.exception.CreativeMindException;
import com.creative_mind.model.*;
import com.creative_mind.model.requests.ParticipantionRequest;
import com.creative_mind.model.requests.RoomRequest;
import com.creative_mind.services.IdeaCsvService;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class RoomRepository {
    @Inject
    EntityManager entityManager;
    @Inject
    IdeaCsvService ideaCsvService;
    @Inject
    IdeaRepository ideaRepository;

    @Transactional
    public Room createRoom(Room room) {
        try {
            this.entityManager.persist(room);
            return room;
        } catch (Exception e) {
            throw new CreativeMindException("Could not create room!", e);
        }
    }

    @Transactional
    public RoomStatus updateRoomState(UUID roomId, RoomStatus state) {
        Room room = this.getRoomByUUID(roomId);
        room.setRoomState(state);
        return room.getRoomState();
    }

    @Transactional
    public Room updateRoom(UUID roomId, RoomRequest roomRequest) {
        Room room = this.getRoomByUUID(roomId);
        boolean changed = false;
        if (roomRequest.getDescription() != null) {
            room.setDescription(roomRequest.getDescription());
        }
        if (roomRequest.getName() != null) {
            room.setName(roomRequest.getName());
        }
        return (room);
    }
    public List<Room> getAllRooms() {
        return this.entityManager.createNamedQuery(Room.GET_ALL_ROOMS, Room.class).getResultList();
    }

    public Room getRoomByUUID(UUID uuid) {

        TypedQuery<Room> roomQuery = this.entityManager
                .createNamedQuery(Room.GET_ROOM_BY_ROOM_ID, Room.class);
        roomQuery.setParameter("roomId", uuid);

        Room room =  roomQuery.getSingleResult();

        if(room == null){
            throw new CreativeMindException(String.format("No room with [%s] available!", uuid.toString()));
        }
        return room;
    }

    public MorphologicalRoom getMorphoRoomByUUID(UUID morphologicalRoomId) {

        TypedQuery<MorphologicalRoom> roomQuery = this.entityManager
                .createNamedQuery(MorphologicalRoom.GET_ROOM_BY_ROOM_ID, MorphologicalRoom.class);
        roomQuery.setParameter("roomId", morphologicalRoomId);

        MorphologicalRoom room;
        try {
            room = roomQuery.getSingleResult();
        } catch (NoResultException e) {
            throw new CreativeMindException(String.format("No room with [%s] available!", morphologicalRoomId.toString()), e);
        }

        return room;
    }

    public byte[] getRoomIdeasAsCSV(UUID roomId) {
        return this.ideaCsvService
                .setCsvFilePath(UUID.randomUUID().toString())
                .createCSVFile(new LinkedList<>(this.ideaRepository.findByRoomId(roomId)))
                .getCsvFileBytes();
    }

    @Transactional
    public void removeRoom(UUID roomId) {
     Room room = this.getRoomByUUID(roomId);

     if (room != null) {
         this.entityManager.remove(room);
     } else {
         Log.error(String.format("Could not delete room with the id [%s]", roomId));
         throw new CreativeMindException(String.format("Room with the id [%s] does not exist!", roomId));
     }
    }
}
