package com.creative_mind.boundary.rest;

import com.creative_mind.model.User;
import com.creative_mind.repository.UserRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/users")
public class UserResource {

    @Inject
    UserRepository userRepository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/list")
    public Response listUsers() {
        return Response.ok(userRepository.getAllUsers()).build();
    }

    @POST
    @Path("/register")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addUser(User user) {

        User addedUser = this.userRepository.createUser(user);

        return Response.ok(addedUser).build();
    }
}
