package com.creative_mind.boundary.rest;

import com.creative_mind.model.requests.ParticipantionRequest;
import com.creative_mind.repository.ParticipationRepository;
import jakarta.inject.Inject;
import jakarta.persistence.NoResultException;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.UUID;

@Path("/api/participations")
public class ParticipationResource {

    @Inject
    ParticipationRepository participationRepository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/list")
    public Response listRooms() {
        try {
            return Response
                    .ok(participationRepository.getAllParticipation())
                    .build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/room/{roomId}")
    public Response getRoomParticipants(@PathParam("roomId") UUID roomId) {
        try {
        return Response
                .ok(participationRepository.getParticipationForRoom(roomId))
                .build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/remove")
    public Response remove(ParticipantionRequest participantRequest) {
        try {

            this.participationRepository.removeParticipation(participantRequest);

            return Response
                    .ok(participationRepository.getAllParticipation())
                    .build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}
