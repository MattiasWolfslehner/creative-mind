package com.creative_mind.repository;

import com.creative_mind.exception.CreativeMindException;
import com.creative_mind.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class UserRepository {

    @Inject
    EntityManager entityManager;

    public List<User> getAllUsers() {
        List<User> users = entityManager
                .createQuery("select u from User u")
                .getResultList();
        return users;
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

            return userQuery.getSingleResult();
        } catch (Exception e) {
            throw new CreativeMindException(String.format("Could not get user[%s]", uuid.toString()), e);
        }
    }
}
