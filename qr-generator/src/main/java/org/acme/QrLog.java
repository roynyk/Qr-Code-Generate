package org.acme;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
public class QrLog extends PanacheEntity {

    public String title;
    public String url;
    public int size;
    public LocalDateTime createdAt;

    // Relasi Database: Setiap QR Code dimiliki oleh 1 User
    @ManyToOne
    public User user;

    public QrLog() {
    }

    public QrLog(String title, String url, int size, User user) {
        this.title = title;
        this.url = url;
        this.size = size;
        this.createdAt = LocalDateTime.now();
        this.user = user;
    }
}