package com.creative_mind.boundary.rest;


import com.creative_mind.manager.RoomManager;
import com.creative_mind.model.Combination;
import com.creative_mind.model.MBParameter;
import com.creative_mind.model.Realization;
import com.creative_mind.model.requests.CreateCombinationRequest;
import com.creative_mind.model.requests.ParameterRequest;
import com.creative_mind.model.requests.RealizationRequest;
import com.creative_mind.repository.MorphoRepository;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.persistence.NoResultException;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/api/morpho")
public class MorphoResource {

    @Inject
    RoomManager roomManager;

    @Inject
    MorphoRepository morphoRepository;

    /**
     * Add a Parameter
     *
     * @param parameterRequest DTO to create a new Parameter
     * @return the Parameter status code of the Realization and the Parameter itself
     */
    @POST
    @Path("/parameter")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addParameter(ParameterRequest parameterRequest) {
        try {

            Log.info(String.format("addParameter room [%s] .", parameterRequest.getRoomId() ));

            // create parameter and ...
            //TODO: IMPORTANT! Check Room Type is MB
            MBParameter parameter = this.morphoRepository.addParameter(parameterRequest);
            // broadcast news to others.
            roomManager.newsForAllSessions(parameterRequest.getRoomId());
            return Response.ok(parameter).build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    /**
     * @param roomId the UUID of the Room
     * @return all Parameters and their respective Realizations of the specific room
     */
    @GET
    @Path("/{roomId}/parameter")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getParameterByRoomId(@PathParam("roomId") String roomId) {
        try {
            Log.info(String.format("getParameterByRoomId room [%s] .", roomId));

            //TODO: IMPORTANT! Check Room Type is MB
            UUID parsedRoomId = UUID.fromString(roomId);
            List<MBParameter> parametersByRoom = this.morphoRepository.findParameterByRoomId(parsedRoomId);

            return Response.ok(parametersByRoom).build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

    }

    /**
     *
     * @param paramId the id of the Parameter that is to be updated
     * @param parameterRequest the Parameter title that the old one needs to be changed to
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/parameter/{paramId}")
    public void overwriteParameter(@PathParam("paramId") int paramId, ParameterRequest parameterRequest) {
        Log.info(String.format("overwriteParameter paramId [%d] .. .room [%s] .", paramId, parameterRequest.getRoomId() ));
        this.morphoRepository.overwriteParameter(paramId, parameterRequest);
    }

    /**
     * Add a Realization
     *
     * @param realizationRequest the DTO to add a Realization
     * @return the Response status code of the Realization and the Realization itself
     */
    @POST
    @Path("/realization")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addRealization(RealizationRequest realizationRequest) {
        Log.info(String.format("addRealization paramId [%s] - [%s] ."
                , realizationRequest.getParamId(), realizationRequest.getContent() ));
        //TODO: IMPORTANT! Check Room Type is MB
        Realization realization = this.morphoRepository.addRealization(realizationRequest);

        return Response.ok(realization).build();
    }

    /**
     * @param realizationId the id of the Realization that is to be updated
     * @param realizationRequest the Realizations content that the old one needs to be changed to
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/realization/{realizationId}")
    public void overwriteRealization(@PathParam("realizationId") int realizationId, RealizationRequest realizationRequest) {
        this.morphoRepository.overwriteRealization(realizationId, realizationRequest);
    }

    /**
     * @param request DTO for the Combination that a specific member of a specific Room creates
     * @return the Response status code of the Combination and the Combination-DTO itself
     */
    @POST
    @Path("/combination")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createCombination(CreateCombinationRequest request) {
        Combination combination = this.morphoRepository.createCombination(request);
        return Response.ok(combination).build();
    }

    @GET
    @Path("/{roomId}/combination")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCombinationsOfRoom(@PathParam("roomId") String roomId){
        try{
            UUID parsedRoomId = UUID.fromString(roomId);
            List<Combination> combinationsOfRoom = this.morphoRepository.findCombinationsOfRoom(parsedRoomId);
            return Response.ok(combinationsOfRoom).build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

}
