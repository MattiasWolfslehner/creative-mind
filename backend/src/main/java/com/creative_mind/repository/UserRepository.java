package com.creative_mind.repository;

import com.creative_mind.exception.CreativeMindException;
import com.creative_mind.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class UserRepository {

    @Inject
    EntityManager entityManager;

    public List<User> getAllUsers() {
        return this.entityManager.createNamedQuery(User.GET_ALL_USERS, User.class).getResultList();
    }

    public List<User> getUsersFromRoom(UUID roomId) {
        try {
            TypedQuery<User> userQuery = this.entityManager
                    .createNamedQuery(User.GET_USERS_FROM_ROOM, User.class);
            userQuery.setParameter("roomId", roomId);
            List<User> userList = userQuery.getResultList();
            return userList;
        } catch (NoResultException ex) {
            return null;
        }
    }

    @Transactional
    public User createUser(User user) {
        try {
            entityManager.persist(user);
            return user;
        } catch (Exception e) {
            throw new CreativeMindException("Could not create user!", e);
        }
    }

    public User getUserByUUID(UUID uuid) {
        try {
            TypedQuery<User> userQuery = this.entityManager
                    .createNamedQuery(User.GET_USER_BY_USER_ID, User.class);
            userQuery.setParameter("userId", uuid);
            User user = userQuery.getSingleResult();
            return user;
        }catch (NoResultException ex){
            return null;
        }
        /*
            if(user == null){
                //throw new CreativeMindException(String.format("No user with [%s] available!", uuid.toString()));

            }
         */

    }
}
