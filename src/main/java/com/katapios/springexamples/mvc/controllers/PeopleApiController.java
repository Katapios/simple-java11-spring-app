package com.katapios.springexamples.mvc.controllers;

import com.katapios.springexamples.mvc.dao.PersonDAO;
import com.katapios.springexamples.mvc.models.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<Person>> getAllPersons(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<Person> persons = peopleDAO.index(page, size);
        int totalCount = peopleDAO.getTotalCount();

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(totalCount));

        return ResponseEntity.ok()
                .headers(headers)
                .body(persons);
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
