package com.creative_mind.boundary.rest;

import com.creative_mind.manager.RoomManager;
import com.creative_mind.model.Room;
import com.creative_mind.model.RoomStatus;
import com.creative_mind.model.requests.RoomRequest;
import com.creative_mind.model.requests.RoomStateRequest;
import com.creative_mind.repository.RoomRepository;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.Claims;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.UUID;

@Path("/api/rooms")
@RequestScoped
public class RoomResource {
    @Inject
    RoomRepository roomRepository;
    @Inject
    RoomManager roomManager;

    @Inject
    JsonWebToken jwt;

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
        UUID adminId = UUID.fromString(jwt.getClaim(Claims.sub));
        room.setAdminId(adminId);
        Room createdRoom = this.roomRepository.createRoom(room);
        return Response.ok(createdRoom).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/get/{roomId}")
    public Response createRoom(@PathParam("roomId") UUID roomId) {
        Room requestedRoom = this.roomRepository.getRoomByUUID(roomId);
        return Response.ok(requestedRoom).build();
    }
    @PUT
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/start/{roomId}")
    public Response startRoom(@PathParam("roomId") UUID roomId) {
        Room thisRoom = this.roomRepository.getRoomByUUID(roomId);
        // not already started?
        if (thisRoom.getRoomState() != RoomStatus.STARTED) {
            roomManager.startRoom(roomId);
            this.roomRepository.updateRoomState(roomId, RoomStatus.STARTED);
            return Response.ok(true).build();
        }
        // error
        return Response.status(400).build();
    }

    @PUT
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/stop/{roomId}")
    public Response stopRoom(@PathParam("roomId") UUID roomId) {
        Room thisRoom = this.roomRepository.getRoomByUUID(roomId);
        // ONLY Started Rooms can be stopped
        if (thisRoom.getRoomState() == RoomStatus.STARTED) {
            roomManager.stopRoom(roomId);
            this.roomRepository.updateRoomState(roomId, RoomStatus.STOPPED);
            return Response.ok(true).build();
        }
        // error
        return Response.status(400).build();
    }

    @PUT
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/updateState/{roomId}")
    public Response updateRoomState(@PathParam("roomId") UUID roomId, RoomStateRequest roomStateRequest) {
        RoomStatus state = this.roomRepository.updateRoomState(roomId, roomStateRequest.getRoomState());
        return Response.ok(state).build();
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/update/{roomId}")
    public Response updateRoom(@PathParam("roomId") UUID roomId, RoomRequest roomRequest) {
        Room changedRoom = this.roomRepository.updateRoom(roomId, roomRequest);
        return Response.ok(changedRoom).build();
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
