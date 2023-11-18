package com.creative_mind.boundary.rest;

import com.creative_mind.model.Room;
import com.creative_mind.repository.ParticipationRepository;
import com.creative_mind.repository.RoomRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.hibernate.Incubating;

@Path("/api/rooms")
public class RoomResource {
    @Inject
    RoomRepository roomRepository;
    @Incubating
    ParticipationRepository participationRepository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/list")
    public Response listRooms() {
        return Response.ok(roomRepository.getAllRooms()).build();
    }


    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/create")
    public Response createRoom(Room room) {

        Room createdRoom = this.roomRepository.createRoom(room);

        return Response.ok(createdRoom).build();
    }
}
