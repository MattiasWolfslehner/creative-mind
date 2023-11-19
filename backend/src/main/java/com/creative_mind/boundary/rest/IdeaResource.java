package com.creative_mind.boundary.rest;

import com.creative_mind.model.Idea;
import com.creative_mind.model.requests.IdeaRequest;
import com.creative_mind.repository.IdeaRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import java.util.List;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.UUID;

@Path("/api/ideas")
public class IdeaResource {
    @Inject
    IdeaRepository ideaRepository;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addIdea(IdeaRequest ideaRequest){
        Idea idea = this.ideaRepository.addIdea(ideaRequest);
        return Response.ok(idea).build();
    }

    @GET
    @Path("/{roomId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getIdeasByRoomId(@PathParam("roomId") String roomId){
        UUID parsedRoomId = UUID.fromString(roomId);
        List<Idea> ideasByRoom = this.ideaRepository.findByRoomId(parsedRoomId);
        return Response.ok(ideasByRoom).build();
    }

}
