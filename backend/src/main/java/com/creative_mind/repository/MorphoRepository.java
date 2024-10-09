package com.creative_mind.repository;

import com.creative_mind.manager.RoomManager;
import com.creative_mind.model.*;
import com.creative_mind.model.requests.CreateCombinationRequest;
import com.creative_mind.model.requests.ParameterRequest;
import com.creative_mind.model.requests.RealizationRequest;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@ApplicationScoped
public class MorphoRepository {

    @Inject
    UserRepository userRepository;

    @Inject
    RoomRepository roomRepository;

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
        parameterQuery.setParameter("paramId", realizationRequest.getParamId());

        MBParameter parameter = parameterQuery.getSingleResult();

        Realization realization = new Realization(realizationRequest.getContent(), parameter);

        TypedQuery<UUID> roomQuery = this.entityManager.createNamedQuery(MBParameter.FIND_ROOM_BY_PARAMID, UUID.class);
        roomQuery.setParameter("paramId", parameter.getParamId());
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

    /************** Combinations **************/
    @Transactional
    public Combination createCombination(CreateCombinationRequest request) {
        // Fetch the room by UUID
        Room room = this.roomRepository.getRoomByUUID(request.getMorphologicalRoomId());

        // Check if the room is a MorphologicalRoom
        if (!(room instanceof MorphologicalRoom)) {
            throw new IllegalArgumentException("The room is not a MorphologicalRoom");
        }

        // Cast room to MorphologicalRoom
        MorphologicalRoom morphologicalRoom = (MorphologicalRoom) room;
        User creatingMember = this.userRepository.getUserByUUID(request.getMemberId());

        Set<Realization> realizations = new HashSet<>(this.findAllRealizationsByIds(request.getRealizationIds()));

        Combination combination = new Combination();
        combination.setMorphologicalRoom(morphologicalRoom);
        combination.setMember(creatingMember);
        combination.setRealizationSet(realizations);

        this.entityManager.persist(combination);

        return combination;
    }

    // Find all Realizations by a list of IDs
    public Set<Realization> findAllRealizationsByIds(Set<Integer> ids) {
        return new HashSet<>(entityManager.createNamedQuery(Realization.RETURN_REALIZATION_SET, Realization.class)
                .setParameter("ids", ids)
                .getResultList());
    }
}
