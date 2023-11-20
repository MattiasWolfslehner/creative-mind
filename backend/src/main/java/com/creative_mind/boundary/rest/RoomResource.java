package com.creative_mind.boundary.rest;

import com.creative_mind.model.Room;
import com.creative_mind.repository.ParticipationRepository;
import com.creative_mind.repository.RoomRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.hibernate.Incubating;

import java.util.UUID;

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

    @GET
    @Path("{room_id}/download/csv")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadCSV(@PathParam("room_id") UUID roomId) {
        byte[] fileBytes = this.roomRepository.getRoomIdeasAsCSV(roomId);
        String contentDisposition = "attachment; filename=\"room-ideas-download-" + roomId + ".csv\"";

        return Response.ok(fileBytes, MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", contentDisposition)
                .build();
    }
}
