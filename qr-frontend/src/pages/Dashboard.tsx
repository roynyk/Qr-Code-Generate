import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  LogOut,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  QrCode,
} from "lucide-react";

interface QrLog {
  id: number;
  title: string;
  url: string;
  size: number;
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [history, setHistory] = useState<QrLog[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [size, setSize] = useState(300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch riwayat QR Code dari Backend PostgreSQL Quarkus
  const fetchHistory = async () => {
    try {
      const res = await axiosClient.get("/api/qr/history");
      setHistory(res.data);
    } catch (err: any) {
      console.error("Gagal mengambil riwayat QR", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Simpan QR Code baru ke Backend PostgreSQL
  const handleGenerateAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    setError("");
    setLoading(true);

    try {
      await axiosClient.post("/api/qr/save", { title, url, size });
      setTitle("");
      setUrl("");
      fetchHistory(); // Refresh riwayat dari PostgreSQL
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan QR Code");
    } finally {
      setLoading(false);
    }
  };

  // Hapus QR Code dari PostgreSQL
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus QR Code ini dari database?")) return;
    try {
      await axiosClient.delete(`/api/qr/history/${id}`);
      fetchHistory();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menghapus QR code");
    }
  };

  return (
    <div className="min-h-screen bg-[#252525] text-[#CFCFCF] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#7D7D7D]/40 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-[#CFCFCF] flex items-center gap-2">
              ⚡ QR Code Studio{" "}
            </h1>
            <p className="text-[#7D7D7D] text-sm mt-1">
              Selamat datang,{" "}
              <span className="text-white font-semibold">{user}</span>! Kelola
              koleksi QR Code kamu.
            </p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="border-[#7D7D7D] text-rose-300 hover:bg-rose-950/50 hover:text-rose-200 self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PANEL KIRI: Form Generator */}
          <Card className="bg-[#545454]/40 border-[#7D7D7D]/40 text-[#CFCFCF] h-fit shadow-2xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#CFCFCF] flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Buat QR Code Baru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateAndSave} className="space-y-4">
                {error && (
                  <div className="bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#CFCFCF]">
                    Judul / Label Link
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    required
                    placeholder="Contoh: GitHub Portofolioku"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-[#252525] border-[#7D7D7D] text-[#CFCFCF] placeholder-[#7D7D7D]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url" className="text-[#CFCFCF]">
                    URL Target Website
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    required
                    placeholder="https://github.com/username"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-[#252525] border-[#7D7D7D] text-[#CFCFCF] placeholder-[#7D7D7D]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size" className="text-[#CFCFCF]">
                    Ukuran QR Code
                  </Label>
                  <select
                    id="size"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full bg-[#252525] border border-[#7D7D7D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#CFCFCF] text-[#CFCFCF]"
                  >
                    <option value={200} className="bg-[#252525]">
                      Kecil (200x200 px)
                    </option>
                    <option value={300} className="bg-[#252525]">
                      Sedang (300x300 px)
                    </option>
                    <option value={400} className="bg-[#252525]">
                      Besar (400x400 px)
                    </option>
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#CFCFCF] hover:bg-white text-[#252525] font-bold py-3 rounded-xl mt-2"
                >
                  {loading ? "Memproses..." : "🚀 Generate"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* PANEL KANAN: Riwayat History dari PostgreSQL */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#CFCFCF] flex items-center gap-2">
                <QrCode className="w-5 h-5" /> Riwayat QR Code Kamu (
                {history.length})
              </h2>
            </div>

            {history.length === 0 ? (
              <div className="bg-[#545454]/20 border border-[#7D7D7D]/40 border-dashed rounded-2xl p-12 text-center text-[#7D7D7D]">
                <p className="text-4xl mb-3">📥</p>
                <p className="text-sm font-medium">
                  Belum ada QR Code di database PostgreSQL kamu.
                </p>
                <p className="text-xs text-[#7D7D7D]/70 mt-1">
                  Isi form di sebelah kiri untuk mulai generate!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {history.map((item) => {
                  const qrImageUrl = `http://localhost:8080/api/qr/generate?url=${encodeURIComponent(item.url)}&size=${item.size}`;
                  return (
                    <Card
                      key={item.id}
                      className="bg-[#545454]/50 border-[#7D7D7D]/50 text-[#CFCFCF] shadow-xl flex flex-col justify-between hover:border-[#CFCFCF] transition"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-[#CFCFCF] truncate text-base">
                            {item.title}
                          </h3>
                          <span className="text-[10px] text-[#CFCFCF]/70 whitespace-nowrap bg-[#252525] px-2 py-0.5 rounded-md border border-[#7D7D7D]">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString(
                                  "id-ID",
                                  { hour: "2-digit", minute: "2-digit" },
                                )
                              : "-"}
                          </span>
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#CFCFCF]/80 hover:underline flex items-center gap-1 truncate mb-4 font-medium"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />{" "}
                          {item.url}
                        </a>

                        {/* Gambar QR Code dari API Backend Quarkus */}
                        <div className="bg-[#CFCFCF] p-3 rounded-xl flex items-center justify-center mb-4 border border-[#7D7D7D] shadow-inner">
                          <img
                            src={qrImageUrl}
                            alt={item.title}
                            className="max-h-44 object-contain"
                          />
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex gap-2">
                          <a
                            href={qrImageUrl}
                            download={`QR-${item.title}.png`}
                            className="flex-1 bg-[#CFCFCF] hover:bg-white text-[#252525] text-xs font-bold py-2.5 px-3 rounded-lg text-center transition border border-[#7D7D7D] flex items-center justify-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </a>
                          <Button
                            onClick={() => handleDelete(item.id)}
                            variant="destructive"
                            size="icon"
                            className="bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
