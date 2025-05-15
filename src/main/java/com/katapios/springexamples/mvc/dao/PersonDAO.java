package com.katapios.springexamples.mvc.dao;

import com.katapios.springexamples.mvc.models.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PersonDAO {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public PersonDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Person> index(int page, int size, String sortField, String sortDirection) {
        int offset = (page - 1) * size;
        String sql = String.format("SELECT * FROM Person ORDER BY %s %s LIMIT ? OFFSET ?",
                validateSortField(sortField),
                validateSortDirection(sortDirection));

        return jdbcTemplate.query(
                sql,
                new Object[]{size, offset},
                new BeanPropertyRowMapper<>(Person.class)
        );
    }

    public int getTotalCount() {
        return jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM Person",
                Integer.class
        );
    }

    public List<Person> search(String searchTerm, int page, int size, String sortField, String sortDirection) {
        int offset = (page - 1) * size;
        String searchPattern = "%" + searchTerm.toLowerCase() + "%";
        String sql = String.format(
                "SELECT * FROM Person " +
                        "WHERE LOWER(name) LIKE ? OR " +
                        "LOWER(email) LIKE ? OR " +
                        "CAST(age AS TEXT) LIKE ? " +
                        "ORDER BY %s %s LIMIT ? OFFSET ?",
                validateSortField(sortField),
                validateSortDirection(sortDirection));

        return jdbcTemplate.query(
                sql,
                new Object[]{
                        searchPattern,
                        searchPattern,
                        searchPattern,
                        size,
                        offset
                },
                new BeanPropertyRowMapper<>(Person.class)
        );
    }

    public int getSearchCount(String searchTerm) {
        String searchPattern = "%" + searchTerm.toLowerCase() + "%";

        return jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM Person " +
                        "WHERE LOWER(name) LIKE ? OR " +
                        "LOWER(email) LIKE ? OR " +
                        "CAST(age AS TEXT) LIKE ?",
                new Object[]{
                        searchPattern,
                        searchPattern,
                        searchPattern
                },
                Integer.class
        );
    }

    // Остальные методы остаются без изменений
    public Person show(int id) {
        return jdbcTemplate.query(
                        "SELECT * FROM Person WHERE id=?",
                        new Object[]{id},
                        new BeanPropertyRowMapper<>(Person.class))
                .stream().findAny().orElse(null);
    }

    public void save(Person person) {
        jdbcTemplate.update(
                "INSERT INTO Person VALUES(default,?,?,?)",
                person.getName(), person.getAge(), person.getEmail()
        );
    }

    public void update(int id, Person updatedPerson) {
        jdbcTemplate.update(
                "UPDATE Person SET name=?, age=?, email=? WHERE id=?",
                updatedPerson.getName(),
                updatedPerson.getAge(),
                updatedPerson.getEmail(),
                id
        );
    }

    public void delete(int id) {
        jdbcTemplate.update("DELETE FROM Person WHERE id=?", id);
    }

    // Валидация полей для сортировки
    private String validateSortField(String field) {
        if (field == null || field.isEmpty()) {
            return "id";
        }

        switch (field.toLowerCase()) {
            case "name":
            case "age":
            case "email":
                return field;
            default:
                return "id";
        }
    }

    // Валидация направления сортировки
    private String validateSortDirection(String direction) {
        if (direction == null || direction.isEmpty()) {
            return "ASC";
        }

        return "ASC".equalsIgnoreCase(direction) ? "ASC" : "DESC";
    }
}
