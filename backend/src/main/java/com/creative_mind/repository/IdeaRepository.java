/*package com.creative_mind.repository;

import com.creative_mind.model.Idea;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.*;

@ApplicationScoped
public class IdeaRepository {
    private HashMap<String, LinkedList<Idea>> ideas;

    public IdeaRepository() {
        this.ideas = new HashMap<>();
    }

    public Set<String> getAllUUIDS(){
        return this.ideas.keySet();
    }

    public LinkedList<Idea> insert(String uuid, Idea idea){

        LinkedList<Idea> ideas = this.ideas.get(uuid);

        // sets the current idea id based on the given list size
        this.setIdeaId(idea, ideas.isEmpty() ? 0 : ideas.getLast().getId() + 1);

        ideas.add(idea);

        this.ideas.put(uuid, ideas);

        return this.ideas.get(uuid);
    }


    public LinkedList<Idea> overrideList(String uuid, LinkedList<Idea> ideaList){

        this.ideas.put(uuid, ideaList);

        return this.ideas.get(uuid);
    }


    public boolean register(String uuid){
        if(this.ideas.containsKey(uuid)){
            return false;
        }
        this.overrideList(uuid, new LinkedList<>());
        return true;
    }

    public LinkedList<Idea> getIdeas(String uuid){
        return this.ideas.get(uuid);
    }

    private void setIdeaId(Idea idea, int id){
        idea.setId(id);
    }

}
*/