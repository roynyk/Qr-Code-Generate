import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.post("/api/auth/login", {
        username,
        password,
      });
      login(res.data.token, res.data.username);
      navigate("/dashboard");
    } catch (err: any) {
      if (!err.response) {
        setError(
          "Gagal terhubung ke backend. Pastikan server Quarkus (port 8080) menyala!",
        );
      } else {
        setError(
          err.response?.data?.message || "Username atau password salah!",
        );
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
            Selamat Datang 🔑
          </CardTitle>
          <CardDescription className="text-[#7D7D7D]">
            Login untuk mengelola koleksi QR Code milikmu.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs p-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#CFCFCF]">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                required
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#252525] border-[#7D7D7D] text-[#CFCFCF] placeholder-[#7D7D7D]"
              />
            </div>
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CFCFCF] text-[#252525] hover:bg-white font-bold"
            >
              {loading ? "Memproses..." : "Masuk Akun"}
            </Button>
            <p className="text-xs text-center text-[#7D7D7D]">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-[#CFCFCF] underline hover:text-white"
              >
                Daftar di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
