package com.creative_mind.boundary.rest;

import com.creative_mind.model.User;
import com.creative_mind.repository.UserRepository;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.eclipse.microprofile.jwt.Claims;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.UUID;

@Path("/api/users")
@RequestScoped
public class UserResource {

    @Inject
    UserRepository userRepository;

    @Inject
    JsonWebToken jwt;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/list")
    public Response listUsers() {
        return Response.ok(userRepository.getAllUsers()).build();
    }

    @GET
    @Path("/register")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addUser() {
        UUID uuid = UUID.fromString(jwt.getClaim(Claims.sub));
        User newUser = new User(uuid);
        User addedUser = this.userRepository.createUser(newUser);
        return Response.ok(addedUser).build();
    }

}
