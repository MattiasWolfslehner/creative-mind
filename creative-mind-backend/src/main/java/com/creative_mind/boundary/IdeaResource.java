package com.creative_mind.boundary;

import com.creative_mind.model.Idea;
import com.creative_mind.repository.IdeaRepository;
import jakarta.inject.Inject;
import jakarta.persistence.Column;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.annotations.Pos;

import java.util.List;

@Path("/api/ideas")
public class IdeaResource {

    @Inject
    IdeaRepository ideaRepository;
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/list")
    public Response getIdeas() {
        return Response.ok(ideaRepository.getIdeas()).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addIdea(Idea idea) {
        this.ideaRepository.insert(idea);
        return Response.ok(ideaRepository.getIdeas()).build();
    }

    @POST
    @Path("/sync")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addIdeaList(List<Idea> idea) {
        this.ideaRepository.overrideList(idea);
        return Response.ok(ideaRepository.getIdeas()).build();
    }

}
