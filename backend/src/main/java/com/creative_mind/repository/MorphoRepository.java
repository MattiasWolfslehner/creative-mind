package com.creative_mind.repository;

import com.creative_mind.manager.RoomManager;
import com.creative_mind.model.MBParameter;
import com.creative_mind.model.MorphologicalRoom;
import com.creative_mind.model.Realization;
import com.creative_mind.model.requests.ParameterRequest;
import com.creative_mind.model.requests.RealizationRequest;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class MorphoRepository {

    @Inject
    RoomManager roomManager;

    @Inject
    EntityManager entityManager;

    @Transactional
    public MBParameter addParameter(ParameterRequest parameterRequest) {
        TypedQuery<MorphologicalRoom> roomQuery = this.entityManager
                .createNamedQuery(MorphologicalRoom.GET_ROOM_BY_ROOM_ID, MorphologicalRoom.class);
        roomQuery.setParameter("roomId", parameterRequest.getRoomId());

        MorphologicalRoom room = roomQuery.getSingleResult();

        MBParameter parameter = new MBParameter(parameterRequest.getTitle(), room);

        this.entityManager.persist(parameter);

        return parameter;
    }

    @Transactional
    public Realization addRealization(RealizationRequest realizationRequest) {
        TypedQuery<MBParameter> parameterQuery = this.entityManager.createNamedQuery(MBParameter.FIND_PARAMETER_BY_PARAMID, MBParameter.class);
        parameterQuery.setParameter("paramId",realizationRequest.getParamId());

        MBParameter parameter = parameterQuery.getSingleResult();

        Realization realization = new Realization(realizationRequest.getContent(), parameter);

        TypedQuery<UUID> roomQuery = this.entityManager.createNamedQuery(MBParameter.FIND_ROOM_BY_PARAMID, UUID.class);
        roomQuery.setParameter("paramId",parameter.getParamId());
        UUID roomId = roomQuery.getSingleResult();
        roomManager.newsForAllSessions(roomId);
        this.entityManager.persist(realization);

        return realization;
    }

    public List<MBParameter> findParameterByRoomId(UUID parsedRoomId) {
        TypedQuery<MBParameter> query = this.entityManager.createNamedQuery(MBParameter.FIND_PARAMETER_BY_ROOM, MBParameter.class);
        query.setParameter("roomId", parsedRoomId);

        return query.getResultList();
    }
}
