package com.creative_mind.boundary.rest;


import com.creative_mind.manager.RoomManager;
import com.creative_mind.model.MBParameter;
import com.creative_mind.model.requests.ParameterRequest;
import com.creative_mind.repository.MorphoRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.lang.reflect.Parameter;

@Path("/api/morpho")
public class MorphoResource {

    @Inject
    RoomManager roomManager;

    @Inject
    MorphoRepository morphoRepository;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addParameter(ParameterRequest parameter) {
        // create parameter and ...
        // Parameter newParam = this.morphoRepository.addParameter(parameter);
        // broadcast news to others.
        // roomManager.newsForAllSessions(ParameterRequest);
        //return Response.ok(newParam).build();
        return null;
    }

}
