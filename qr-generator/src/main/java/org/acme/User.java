package org.acme;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User extends PanacheEntity {

    @Column(unique = true, nullable = false)
    public String username;

    @Column(unique = true, nullable = false)
    public String email;

    @Column(nullable = false)
    public String password;

    public String role = "user";

    public User() {
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = "user";
    }

    public static User findByUsername(String username) {
        return find("username", username).firstResult();
    }

    public static User findByEmail(String email) {
        return find("email", email).firstResult();
    }
}