package org.acme;

import io.quarkus.elytron.security.common.BcryptUtil;
import io.smallrye.jwt.build.Jwt;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    // 1. API REGISTER (4 Field: username, email, password)
    @POST
    @Path("/register")
    @Transactional
    public Response register(AuthRequest request) {
        if (request.username == null || request.email == null || request.password == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "Username, Email, dan Password wajib diisi!"))
                    .build();
        }

        // Cek apakah username sudah terdaftar
        if (User.findByUsername(request.username) != null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "Username sudah dipakai! Gunakan username lain."))
                    .build();
        }

        // Cek apakah email sudah terdaftar
        if (User.findByEmail(request.email) != null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "Email sudah terdaftar! Gunakan email lain."))
                    .build();
        }

        // Hash Password BCrypt
        String hashedPassword = BcryptUtil.bcryptHash(request.password);

        // Simpan user baru dengan Email ke PostgreSQL
        User newUser = new User(request.username, request.email, hashedPassword);
        newUser.persist();

        return Response.ok(Map.of("message", "Registrasi berhasil! Silakan login.")).build();
    }

    // 2. API LOGIN
    @POST
    @Path("/login")
    public Response login(AuthRequest request) {
        if (request.username == null || request.password == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "Username dan password wajib diisi!"))
                    .build();
        }

        User user = User.findByUsername(request.username);

        if (user == null || !BcryptUtil.matches(request.password, user.password)) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("message", "Username atau password salah!"))
                    .build();
        }

        String token = Jwt.issuer("https://qr-studio.com")
                .upn(user.username)
                .groups(new HashSet<>(Arrays.asList("user")))
                .expiresIn(86400)
                .sign();

        return Response.ok(Map.of(
                "token", token,
                "username", user.username,
                "message", "Login berhasil!"
        )).build();
    }

    public static class AuthRequest {
        public String username;
        public String email;
        public String password;
    }
}