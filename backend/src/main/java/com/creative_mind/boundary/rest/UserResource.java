package com.creative_mind.boundary.rest;

import com.creative_mind.model.User;
import com.creative_mind.repository.UserRepository;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
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
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/list/{roomId}")
    public Response listUsersFromRoom(@PathParam("roomId") UUID roomId) {
        return Response.ok(userRepository.getUsersFromRoom(roomId)).build();
    }

    @GET
    @Path("/register")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addUser() {
        UUID uuid = UUID.fromString(jwt.getClaim(Claims.sub));
        String userName = jwt.getClaim(Claims.preferred_username);
        User newUser = new User(uuid, userName);
        User existingUser = this.userRepository.getUserByUUID(uuid);
        //check: login or register
        if(existingUser != null){
            return Response.ok(existingUser).build();//same response object every time needed!
        }else{
            User addedUser = this.userRepository.createUser(newUser);
            return Response.ok(addedUser).build();
        }

    }

}
