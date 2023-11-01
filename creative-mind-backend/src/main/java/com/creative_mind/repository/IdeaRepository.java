package com.creative_mind.repository;

import com.creative_mind.model.Idea;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.LinkedList;
import java.util.List;

@ApplicationScoped
public class IdeaRepository {
    private LinkedList<Idea> ideas;

    public IdeaRepository() {
        this.ideas = new LinkedList<Idea>();
    }

    public LinkedList<Idea> insert(Idea idea){
        this.ideas.add(idea);
        return this.ideas;
    }

    public LinkedList<Idea> insertList(List<Idea> ideaList){
        this.ideas.clear();
        this.ideas.addAll(ideaList);
        return this.ideas;
    }

    public LinkedList<Idea>  getIdeas(){
        return this.ideas;
    }


}
