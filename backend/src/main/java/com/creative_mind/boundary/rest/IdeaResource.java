package com.creative_mind.boundary.rest;/*package com.creative_mind.boundary.rest;

import com.creative_mind.model.Idea;
import com.creative_mind.model.User;
import com.creative_mind.repository.IdeaRepository;
import com.creative_mind.services.IdeaCsvService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.LinkedList;
import java.util.UUID;

@Path("/api/ideas")
public class IdeaResource {
    @Inject
    IdeaRepository ideaRepository;
    @Inject
    IdeaCsvService ideaCsvService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/uuids")
    public Response getIdeas() {
        return Response
                .ok(ideaRepository.getAllUUIDS())
                .build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{userId}/list")
    public Response getIdeas(@PathParam("userId") String uuid) {
        return Response.ok(ideaRepository.getIdeas(uuid)).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/register")
    public Response register() {

        User user = new User();

        this.ideaRepository.register(user.getUuid());

        return Response.ok(user).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/{userId}")
    public Response addIdea(@PathParam("userId") String uuid, Idea idea) {
        this.ideaRepository.insert(uuid, idea);
        return Response
                .ok(ideaRepository.getIdeas(uuid))
                .build();
    }

    @POST
    @Path("/{userId}/sync")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addIdeaList(@PathParam("userId") String uuid, LinkedList<Idea> ideas) {
        this.ideaRepository.overrideList(uuid, ideas);
        return Response.ok(ideaRepository.getIdeas(uuid)).build();
    }

    @GET
    @Path("/{userId}/download/csv")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadCSV(@PathParam("userId") String uuid){

        byte[] fileBytes = this.ideaCsvService
                .setCsvFilePath(UUID.randomUUID().toString())
                .createCSVFile(this.ideaRepository.getIdeas(uuid))
                .getCsvFileBytes();

        String contentDisposition = "attachment; filename=" + this.ideaCsvService.getFileName();

        return Response.ok(fileBytes, MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", contentDisposition)
                .build();
    }

}
*/