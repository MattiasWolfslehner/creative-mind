package com.creative_mind.repository;

import com.creative_mind.exception.CreativeMindException;
import com.creative_mind.model.Room;
import com.creative_mind.services.IdeaCsvService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
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
    public Room createRoom(Room room){
        try{
            this.entityManager.persist(room);
            return room;
        }catch (Exception e){
            throw new CreativeMindException("Could not create room!", e);
        }
    }

    public List<Room> getAllRooms() {
        return this.entityManager.createQuery("select r from Room r").getResultList();
    }

    public Room getRoomByUUID(UUID uuid){
        try{
            TypedQuery<Room> roomQuery = this.entityManager
                    .createNamedQuery(Room.GET_ROOM_BY_ROOM_ID, Room.class);
            roomQuery.setParameter("roomId", uuid);

            return roomQuery.getSingleResult();
        }catch (Exception e){
            throw new CreativeMindException(String.format("Could not get room[%s]", uuid.toString()), e);
        }
    }

    public byte[] getRoomIdeasAsCSV(UUID roomId) {
        return this.ideaCsvService
                .setCsvFilePath(UUID.randomUUID().toString())
                .createCSVFile(new LinkedList<>(this.ideaRepository.findByRoomId(roomId)))
                .getCsvFileBytes();
    }
}
