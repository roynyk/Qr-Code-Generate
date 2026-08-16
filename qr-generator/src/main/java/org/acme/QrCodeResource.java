package org.acme;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import org.eclipse.microprofile.jwt.JsonWebToken;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

@Path("/api/qr")
public class QrCodeResource {

    // Inject Token JWT untuk mengetahui siapa User yang sedang Login!
    @Inject
    JsonWebToken jwt;

    // 1. Endpoint Generate Gambar PNG (Bisa diakses publik tanpa login)
    @GET
    @Path("/generate")
    @Produces("image/png")
    public Response generateQrCode(
            @QueryParam("url") String url,
            @DefaultValue("300") @QueryParam("size") int size) {

        if (url == null || url.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Parameter 'url' wajib diisi!".getBytes())
                    .build();
        }

        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, size, size);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] pngBytes = pngOutputStream.toByteArray();

            return Response.ok(pngBytes)
                    .header("Content-Disposition", "inline; filename=\"qrcode.png\"")
                    .build();

        } catch (Exception e) {
            return Response.serverError()
                    .entity(("Gagal generate QR Code: " + e.getMessage()).getBytes())
                    .build();
        }
    }

    // 2. API SIMPAN (Cuma Bisa Dikelola User Login - @RolesAllowed)
    @POST
    @Path("/save")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("user") 
    @Transactional
    public Response saveQrLog(QrLog input) {
        // Ambil nama user yang sedang login dari Token JWT
        String username = jwt.getName();
        User currentUser = User.findByUsername(username);

        if (currentUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(Map.of("message", "User tidak ditemukan")).build();
        }

        // Simpan QR Code di PostgreSQL dengan pemilik = currentUser
        QrLog log = new QrLog(input.title, input.url, input.size <= 0 ? 300 : input.size, currentUser);
        log.persist();

        return Response.ok(log).build();
    }

    // 3. API RIWAYAT (Cuma Menampilkan QR Code Milik User yang Sedang Login)
    @GET
    @Path("/history")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("user")
    public List<QrLog> getHistory() {
        String username = jwt.getName();
        User currentUser = User.findByUsername(username);

        // Ambil riwayat QR milik currentUser saja!
        return QrLog.list("user = ?1 order by id desc", currentUser);
    }

    // 4. API HAPUS (Cuma Bisa Hapus QR Code Milik Sendiri)
    @DELETE
    @Path("/history/{id}")
    @RolesAllowed("user")
    @Transactional
    public Response deleteHistory(@PathParam("id") Long id) {
        String username = jwt.getName();
        User currentUser = User.findByUsername(username);

        long deleted = QrLog.delete("id = ?1 and user = ?2", id, currentUser);
        if (deleted > 0) {
            return Response.ok().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}