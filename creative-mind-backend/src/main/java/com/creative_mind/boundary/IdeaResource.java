package com.creative_mind.boundary;

import com.creative_mind.model.Idea;
import com.creative_mind.repository.IdeaRepository;
import com.creative_mind.services.IdeaCsvService;
import jakarta.inject.Inject;
import jakarta.persistence.Column;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.annotations.Pos;

import java.awt.*;
import java.util.List;
import java.util.UUID;

@Path("/api/ideas")
public class IdeaResource {

    @Inject
    IdeaRepository ideaRepository;
    @Inject
    IdeaCsvService ideaCsvService;


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

    @GET
    @Path("/download/csv")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadCSV(){

        byte[] fileBytes = this.ideaCsvService
                .setCsvFilePath(UUID.randomUUID().toString())
                .createCSVFile(this.ideaRepository.getIdeas())
                .getCsvFileBytes();

        String contentDisposition = "attachment; filename=" + this.ideaCsvService.getFileName();

        return Response.ok(fileBytes, MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", contentDisposition)
                .build();
    }

}
