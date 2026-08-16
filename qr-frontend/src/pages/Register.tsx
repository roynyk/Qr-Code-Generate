import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi Confirm Password di Client
    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      await axiosClient.post("/api/auth/register", {
        username,
        email,
        password,
      });
      alert("Registrasi Berhasil! Silakan Login.");
      navigate("/login");
    } catch (err: any) {
      if (!err.response) {
        setError(
          "Gagal terhubung ke backend. Pastikan server Quarkus (port 8080) menyala!",
        );
      } else {
        setError(err.response?.data?.message || "Registrasi gagal, coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#252525] text-[#CFCFCF] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#545454]/40 border-[#7D7D7D]/40 text-[#CFCFCF] shadow-2xl backdrop-blur-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#CFCFCF]">
            Buat Akun Baru 🚀
          </CardTitle>
          <CardDescription className="text-[#7D7D7D]">
            Lengkapi data di bawah ini untuk mendaftar.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* 1. Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#CFCFCF]">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                required
                placeholder="Contoh: budisanjaya"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#252525] border-[#7D7D7D] text-[#CFCFCF] placeholder-[#7D7D7D]"
              />
            </div>

            {/* 2. Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#CFCFCF]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="budi@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#252525] border-[#7D7D7D] text-[#CFCFCF] placeholder-[#7D7D7D]"
              />
            </div>

            {/* 3. Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#CFCFCF]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#252525] border-[#7D7D7D] text-[#CFCFCF] placeholder-[#7D7D7D]"
              />
            </div>

            {/* 4. Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#CFCFCF]">
                Konfirmasi Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#252525] border-[#7D7D7D] text-[#CFCFCF] placeholder-[#7D7D7D]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CFCFCF] text-[#252525] hover:bg-white font-bold"
            >
              {loading ? "Memproses..." : "Daftar Akun"}
            </Button>
            <p className="text-xs text-center text-[#7D7D7D]">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="text-[#CFCFCF] underline hover:text-white"
              >
                Login di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
