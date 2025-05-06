package com.katapios.springexamples.mvc.controllers;

import com.katapios.springexamples.mvc.dao.PersonDAO;
import com.katapios.springexamples.mvc.models.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PeopleApiController {

    private final PersonDAO peopleDAO;

    @Autowired
    public PeopleApiController(PersonDAO peopleDAO) {
        this.peopleDAO = peopleDAO;
    }

    @GetMapping("/persons")
    public List<Person> getAllPersons() {
        return peopleDAO.index();
    }
    @PostMapping("/persons")
    public void createPerson(@RequestBody Person person) {
        peopleDAO.save(person);
    }
    @PutMapping("/persons/{id}")
    public void updatePerson(@PathVariable("id") int id, @RequestBody Person person) {
        peopleDAO.update(id, person);
    }
    @DeleteMapping("/persons/{id}")
    public void deletePerson(@PathVariable("id") int id) {
        peopleDAO.delete(id);
    }
}
