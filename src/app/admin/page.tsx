"use client";

import { useState, useEffect } from "react";
import SubpageHeader from "@/components/SubpageHeader";
import {
  loginAdmin,
  verifyMfaCode,
  uploadPhoto,
  fetchPhotos,
  updatePhoto,
  deletePhoto,
  createArticle,
  fetchArticles,
  updateArticle,
  deleteArticle,
  createTrack,
  fetchTracks,
  updateTrack,
  deleteTrack,
} from "./services";

interface Photo {
  id: string;
  title: string;
  url: string;
  year: string;
  date: string;
  category: string;
  location: string;
  aspectRatio: string;
}

interface Article {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  content: string;
  category: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
}

interface Track {
  id: string;
  title: string;
  description: string;
  url: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  // Estados para autenticación MFA
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaSession, setMfaSession] = useState("");

  // Pestañas principales y secundarias
  const [activeTab, setActiveTab] = useState<"photos" | "articles" | "tracks">("photos");
  const [subTab, setSubTab] = useState<"create" | "manage">("create");

  // Listas de recursos
  const [photosList, setPhotosList] = useState<Photo[]>([]);
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [tracksList, setTracksList] = useState<Track[]>([]);
  const [fetchingData, setFetchingData] = useState(false);

  // Modales y estados de edición
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);

  // Formulario Fotos
  const [photoForm, setPhotoForm] = useState({
    title: "",
    category: "Nocturna",
    location: "",
    aspectRatio: "aspect-[4/5]",
    year: "2026",
    date: new Date().toISOString().split("T")[0],
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Formulario Artículos
  const [articleForm, setArticleForm] = useState({
    title: "",
    subtitle: "",
    slug: "",
    content: "",
    category: "AI",
    published: false,
  });

  // Formulario Tracks
  const [trackForm, setTrackForm] = useState({
    id: "",
    title: "",
    description: "",
    url: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // Cargar datos al cambiar a vista de gestión
  useEffect(() => {
    if (isLoggedIn && subTab === "manage") {
      loadResources();
    }
  }, [isLoggedIn, activeTab, subTab]);

  const loadResources = async () => {
    setFetchingData(true);
    setError("");
    try {
      if (activeTab === "photos") {
        const data = await fetchPhotos();
        setPhotosList(data);
      } else if (activeTab === "articles") {
        const data = await fetchArticles();
        setArticlesList(data);
      } else if (activeTab === "tracks") {
        const data = await fetchTracks();
        setTracksList(data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar recursos.";
      setError(msg);
    } finally {
      setFetchingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const data = await loginAdmin(email, password);

      if (data.challengeName === "EMAIL_OTP") {
        setMfaSession(data.session);
        setMfaStep(true);
        setSuccessMessage(
          data.recoveryInitiated
            ? "Proceso de recuperación iniciado. Código enviado a tu correo."
            : "Código de verificación enviado a tu correo."
        );
        return;
      }

      localStorage.setItem("admin_token", data.idToken);
      setToken(data.idToken);
      setIsLoggedIn(true);
    } catch {
      setError("Tu no eres Mateo ;) jajajajajaj");
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const data = await verifyMfaCode(email, mfaCode, mfaSession);
      localStorage.setItem("admin_token", data.idToken);
      setToken(data.idToken);
      setIsLoggedIn(true);
      setMfaStep(false);
      setMfaCode("");
      setMfaSession("");
    } catch {
      setError("Código de verificación incorrecto.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
    setIsLoggedIn(false);
  };

  // HANDLERS FOTOS
  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!photoFile) {
      setError("Por favor, selecciona una imagen para subir.");
      return;
    }
    setLoading(true);

    try {
      await uploadPhoto(token, photoForm, photoFile);
      setSuccessMessage("¡Fotografía subida y registrada en AWS con éxito!");
      setPhotoFile(null);
      setPhotoForm({
        title: "",
        category: "Nocturna",
        location: "",
        aspectRatio: "aspect-[4/5]",
        year: "2026",
        date: new Date().toISOString().split("T")[0],
      });
      if (subTab === "manage") loadResources();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al subir la fotografía.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta fotografía? El archivo en S3 y el registro en la BD serán borrados.")) return;
    setError("");
    try {
      await deletePhoto(token, id);
      setSuccessMessage("Fotografía eliminada con éxito.");
      loadResources();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar la foto.";
      setError(msg);
    }
  };

  const handleUpdatePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    setLoading(true);
    try {
      await updatePhoto(token, editingPhoto.id, {
        title: editingPhoto.title,
        category: editingPhoto.category,
        location: editingPhoto.location,
        aspectRatio: editingPhoto.aspectRatio,
        year: editingPhoto.year,
        date: editingPhoto.date,
      });
      setSuccessMessage("Metadatos de la foto actualizados correctamente.");
      setEditingPhoto(null);
      loadResources();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar foto.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // HANDLERS ARTÍCULOS
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await createArticle(token, articleForm);
      setSuccessMessage("¡Artículo creado y guardado en PostgreSQL con éxito!");
      setArticleForm({
        title: "",
        subtitle: "",
        slug: "",
        content: "",
        category: "AI",
        published: false,
      });
      if (subTab === "manage") loadResources();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar el artículo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este artículo?")) return;
    setError("");
    try {
      await deleteArticle(token, id);
      setSuccessMessage("Artículo eliminado con éxito.");
      loadResources();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar artículo.";
      setError(msg);
    }
  };

  const handleUpdateArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setLoading(true);
    try {
      await updateArticle(token, editingArticle.id, {
        title: editingArticle.title,
        subtitle: editingArticle.subtitle,
        slug: editingArticle.slug,
        content: editingArticle.content,
        category: editingArticle.category,
        published: editingArticle.published,
      });
      setSuccessMessage("Artículo actualizado correctamente.");
      setEditingArticle(null);
      loadResources();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar artículo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // HANDLERS TRACKS
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await createTrack(token, trackForm);
      setSuccessMessage("¡Playlist añadida a la radio con éxito!");
      setTrackForm({
        id: "",
        title: "",
        description: "",
        url: "",
      });
      if (subTab === "manage") loadResources();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar la playlist.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrack = async (id: string) => {
    if (!confirm("¿Estás seguro de quitar esta playlist de la radio?")) return;
    setError("");
    try {
      await deleteTrack(token, id);
      setSuccessMessage("Playlist eliminada de la radio.");
      loadResources();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar la playlist.";
      setError(msg);
    }
  };

  const handleUpdateTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack) return;
    setLoading(true);
    try {
      await updateTrack(token, editingTrack.id, {
        title: editingTrack.title,
        description: editingTrack.description,
        url: editingTrack.url,
      });
      setSuccessMessage("Playlist actualizada correctamente.");
      setEditingTrack(null);
      loadResources();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar playlist.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // VISTA 1: Formulario de Login / Verificación MFA
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 font-sans selection:bg-white selection:text-black">
        <div className="w-full max-w-md p-8 border border-neutral-800 bg-neutral-950 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-mono font-extrabold tracking-widest uppercase">ADMIN // HUBSITE</h1>
            <p className="text-xs text-neutral-500 font-mono">AUTENTICACIÓN REQUERIDA (COGNITO)</p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs font-mono text-center">
              [ ERROR: {error} ]
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-950/40 border border-green-800 text-green-200 text-xs font-mono text-center">
              [ {successMessage} ]
            </div>
          )}

          {mfaStep ? (
            <form onSubmit={handleMfaSubmit} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 block uppercase">CÓDIGO DE VERIFICACIÓN (MFA EN CORREO)</label>
                <input
                  type="text"
                  required
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:outline-none focus:border-white transition-colors tracking-widest text-center text-lg font-bold"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black p-3 font-bold uppercase hover:bg-neutral-200 transition-colors"
              >
                {loading ? "VERIFICANDO..." : "COMPLETAR ACCESO"}
              </button>

              <button
                type="button"
                onClick={() => { setMfaStep(false); setError(""); setSuccessMessage(""); }}
                className="w-full text-neutral-500 hover:text-white transition-colors text-center text-[10px] uppercase font-bold"
              >
                [ ← VOLVER AL LOGIN ]
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 block uppercase">CORREO ELECTRÓNICO</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 block uppercase">CONTRASEÑA</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="********"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black p-3 font-bold uppercase hover:bg-neutral-200 transition-colors"
              >
                {loading ? "AUTENTICANDO..." : "INICIAR SESIÓN"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // VISTA 2: Dashboard del Administrador
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-sans text-neutral-900 dark:text-neutral-100 pb-20">
      <SubpageHeader sectionNumber="AD" />

      {/* Cabecera Admin */}
      <section className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-neutral-300 dark:border-neutral-800 pb-6">
        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight uppercase">PANEL ADMINISTRADOR</h1>
          <p className="text-xs font-mono text-neutral-500">CONECTADO A AWS RDS & COGNITO</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-red-500 text-red-500 font-mono text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-colors"
        >
          [ CERRAR SESIÓN ]
        </button>
      </section>

      {/* Alertas */}
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-mono">
          [ ERROR: {error} ]
        </div>
      )}
      {successMessage && (
        <div className="p-3 bg-green-100 dark:bg-green-950/40 border border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 text-xs font-mono">
          [ ÉXITO: {successMessage} ]
        </div>
      )}

      {/* Navegación por Pestañas Principales */}
      <div className="flex border-b border-neutral-300 dark:border-neutral-800 gap-4 font-mono text-xs sm:text-sm">
        <button
          onClick={() => { setActiveTab("photos"); setError(""); setSuccessMessage(""); }}
          className={`pb-2 px-2 transition-all ${
            activeTab === "photos"
              ? "font-bold border-b-2 border-black dark:border-white text-black dark:text-white"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          FOTOGRAFÍAS
        </button>
        <button
          onClick={() => { setActiveTab("articles"); setError(""); setSuccessMessage(""); }}
          className={`pb-2 px-2 transition-all ${
            activeTab === "articles"
              ? "font-bold border-b-2 border-black dark:border-white text-black dark:text-white"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          ARTÍCULOS
        </button>
        <button
          onClick={() => { setActiveTab("tracks"); setError(""); setSuccessMessage(""); }}
          className={`pb-2 px-2 transition-all ${
            activeTab === "tracks"
              ? "font-bold border-b-2 border-black dark:border-white text-black dark:text-white"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          PLAYLISTS
        </button>
      </div>

      {/* Sub-Pestañas (Crear vs Gestionar) */}
      <div className="flex gap-2 font-mono text-xs">
        <button
          onClick={() => setSubTab("create")}
          className={`px-3 py-1 border transition-colors ${
            subTab === "create"
              ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white font-bold"
              : "border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          [ + NUEVO REGISTRO ]
        </button>
        <button
          onClick={() => setSubTab("manage")}
          className={`px-3 py-1 border transition-colors ${
            subTab === "manage"
              ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white font-bold"
              : "border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          [ 📋 LISTA Y EDICIÓN ]
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="bg-neutral-50 dark:bg-neutral-950 p-6 border border-neutral-200 dark:border-neutral-900 rounded-none shadow-sm">

        {/* 1. SECCIÓN FOTOS */}
        {activeTab === "photos" && (
          subTab === "create" ? (
            <form onSubmit={handlePhotoSubmit} className="space-y-4 font-mono text-xs">
              <h2 className="text-sm font-bold uppercase mb-2">{"// SUBIR NUEVA FOTOGRAFÍA"}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-500 block">TÍTULO</label>
                  <input
                    type="text"
                    required
                    value={photoForm.title}
                    onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                    placeholder="Ej: Niebla en el Páramo"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-500 block">CATEGORÍA</label>
                  <input
                    type="text"
                    required
                    value={photoForm.category}
                    onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                    placeholder="Ej: Nocturna, Arquitectura..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-500 block">UBICACIÓN / LUGAR</label>
                  <input
                    type="text"
                    required
                    value={photoForm.location}
                    onChange={(e) => setPhotoForm({ ...photoForm, location: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                    placeholder="Ej: Bogotá, Colombia"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-500 block">ASPECT RATIO (CSS)</label>
                  <select
                    value={photoForm.aspectRatio}
                    onChange={(e) => setPhotoForm({ ...photoForm, aspectRatio: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                  >
                    <option value="aspect-[4/5]">Vertical (4:5)</option>
                    <option value="aspect-[16/9]">Horizontal (16:9)</option>
                    <option value="aspect-[1/1]">Cuadrado (1:1)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-500 block">AÑO</label>
                  <input
                    type="text"
                    required
                    value={photoForm.year}
                    onChange={(e) => setPhotoForm({ ...photoForm, year: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-500 block">FECHA EXACTA</label>
                  <input
                    type="date"
                    required
                    value={photoForm.date}
                    onChange={(e) => setPhotoForm({ ...photoForm, date: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-neutral-500 block">ARCHIVO DE IMAGEN (DIRECTO A S3)</label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-neutral-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                {loading ? "SUBIENDO FOTO..." : "REGISTRAR Y SUBIR FOTO"}
              </button>
            </form>
          ) : (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-sm font-bold uppercase mb-2">{"// GESTIÓN DE FOTOGRAFÍAS"}</h2>
              {fetchingData ? (
                <p className="text-neutral-500">Cargando lista de fotografías...</p>
              ) : photosList.length === 0 ? (
                <p className="text-neutral-500">No hay fotografías registradas.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {photosList.map((photo) => (
                    <div key={photo.id} className="border border-neutral-200 dark:border-neutral-800 p-3 flex gap-3 items-center bg-white dark:bg-neutral-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt={photo.title} className="w-16 h-16 object-cover border border-neutral-700" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate">{photo.title}</h3>
                        <p className="text-[10px] text-neutral-500">{photo.category} • {photo.location} ({photo.year})</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => setEditingPhoto(photo)}
                          className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white font-bold hover:bg-neutral-300 text-[10px]"
                        >
                          EDITAR
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="px-2 py-1 bg-red-600 text-white font-bold hover:bg-red-700 text-[10px]"
                        >
                          ELIMINAR
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}

        {/* 2. SECCIÓN ARTÍCULOS */}
        {activeTab === "articles" && (
          subTab === "create" ? (
            <form onSubmit={handleArticleSubmit} className="space-y-4 font-mono text-xs">
              <h2 className="text-sm font-bold uppercase mb-2">{"// NUEVO ESCRITO / ARTÍCULO"}</h2>

              <div className="space-y-1">
                <label className="text-neutral-500 block">TÍTULO</label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                  placeholder="Ej: El futuro de la Inteligencia Artificial"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 block">SUBTÍTULO</label>
                <input
                  type="text"
                  value={articleForm.subtitle}
                  onChange={(e) => setArticleForm({ ...articleForm, subtitle: e.target.value })}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                  placeholder="Ej: Reflexiones sobre el impacto social"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-500 block">SLUG (URL AMIGABLE)</label>
                  <input
                    type="text"
                    required
                    value={articleForm.slug}
                    onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                    placeholder="ej-el-futuro-de-la-ia"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-500 block">CATEGORÍA</label>
                  <input
                    type="text"
                    required
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                    placeholder="Ej: AI, Cloud, Filosofía"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 block">CONTENIDO (MARKDOWN)</label>
                <textarea
                  required
                  rows={10}
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none font-sans"
                  placeholder="# Título Principal&#10;&#10;Escribe tu contenido aquí..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={articleForm.published}
                  onChange={(e) => setArticleForm({ ...articleForm, published: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-800 text-black focus:ring-0"
                />
                <label htmlFor="published" className="text-neutral-500 uppercase select-none">PUBLICAR INMEDIATAMENTE</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                {loading ? "GUARDANDO..." : "CREAR Y GUARDAR ARTÍCULO"}
              </button>
            </form>
          ) : (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-sm font-bold uppercase mb-2">{"// GESTIÓN DE ARTÍCULOS"}</h2>
              {fetchingData ? (
                <p className="text-neutral-500">Cargando artículos...</p>
              ) : articlesList.length === 0 ? (
                <p className="text-neutral-500">No hay artículos guardados.</p>
              ) : (
                <div className="space-y-3">
                  {articlesList.map((art) => (
                    <div key={art.id} className="border border-neutral-200 dark:border-neutral-800 p-3 flex justify-between items-center bg-white dark:bg-neutral-900">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm">{art.title}</h3>
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${art.published ? "bg-green-800 text-green-100" : "bg-neutral-700 text-neutral-300"}`}>
                            {art.published ? "PUBLICADO" : "BORRADOR"}
                          </span>
                        </div>
                        <p className="text-neutral-500 text-[10px]">{art.category} • /{art.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingArticle(art)}
                          className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white font-bold hover:bg-neutral-300 text-[10px]"
                        >
                          EDITAR
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="px-3 py-1 bg-red-600 text-white font-bold hover:bg-red-700 text-[10px]"
                        >
                          ELIMINAR
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}

        {/* 3. SECCIÓN TRACKS */}
        {activeTab === "tracks" && (
          subTab === "create" ? (
            <form onSubmit={handleTrackSubmit} className="space-y-4 font-mono text-xs">
              <h2 className="text-sm font-bold uppercase mb-2">{"// AGREGAR PLAYLIST DE SPOTIFY"}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-500 block">ID DE LA PLAYLIST DE SPOTIFY</label>
                  <input
                    type="text"
                    required
                    value={trackForm.id}
                    onChange={(e) => setTrackForm({ ...trackForm, id: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                    placeholder="Ej: 1iQ2ovIssKp5YiXMpKJJ1Q"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-500 block">TÍTULO DE LA PLAYLIST</label>
                  <input
                    type="text"
                    required
                    value={trackForm.title}
                    onChange={(e) => setTrackForm({ ...trackForm, title: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                    placeholder="Ej: Rapcito del bueno"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 block">DESCRIPCIÓN</label>
                <textarea
                  required
                  rows={3}
                  value={trackForm.description}
                  onChange={(e) => setTrackForm({ ...trackForm, description: e.target.value })}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                  placeholder="Ej: Selección de barras puras..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 block">URL DE LA PLAYLIST</label>
                <input
                  type="text"
                  required
                  value={trackForm.url}
                  onChange={(e) => setTrackForm({ ...trackForm, url: e.target.value })}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                  placeholder="https://open.spotify.com/playlist/..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                {loading ? "GUARDANDO..." : "AÑADIR PLAYLIST"}
              </button>
            </form>
          ) : (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-sm font-bold uppercase mb-2">{"// GESTIÓN DE PLAYLISTS DE SPOTIFY"}</h2>
              {fetchingData ? (
                <p className="text-neutral-500">Cargando playlists...</p>
              ) : tracksList.length === 0 ? (
                <p className="text-neutral-500">No hay playlists agregadas.</p>
              ) : (
                <div className="space-y-3">
                  {tracksList.map((tr) => (
                    <div key={tr.id} className="border border-neutral-200 dark:border-neutral-800 p-3 flex justify-between items-center bg-white dark:bg-neutral-900">
                      <div>
                        <h3 className="font-bold text-sm">{tr.title}</h3>
                        <p className="text-neutral-500 text-[10px]">{tr.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingTrack(tr)}
                          className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white font-bold hover:bg-neutral-300 text-[10px]"
                        >
                          EDITAR
                        </button>
                        <button
                          onClick={() => handleDeleteTrack(tr.id)}
                          className="px-3 py-1 bg-red-600 text-white font-bold hover:bg-red-700 text-[10px]"
                        >
                          ELIMINAR
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* MODAL DE EDICIÓN FOTO */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 font-mono text-xs">
          <div className="bg-neutral-900 border border-neutral-700 p-6 max-w-lg w-full space-y-4">
            <h2 className="font-bold uppercase text-sm">EDITAR METADATOS FOTO</h2>
            <form onSubmit={handleUpdatePhotoSubmit} className="space-y-3">
              <div>
                <label className="text-neutral-400 block">TÍTULO</label>
                <input
                  type="text"
                  value={editingPhoto.title}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-400 block">CATEGORÍA</label>
                  <input
                    type="text"
                    value={editingPhoto.category}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block">UBICACIÓN</label>
                  <input
                    type="text"
                    value={editingPhoto.location}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-400 block">AÑO</label>
                  <input
                    type="text"
                    value={editingPhoto.year}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, year: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block">FECHA</label>
                  <input
                    type="date"
                    value={editingPhoto.date}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, date: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-400 uppercase font-bold"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-white text-black font-bold uppercase"
                >
                  GUARDAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN ARTÍCULO */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 font-mono text-xs">
          <div className="bg-neutral-900 border border-neutral-700 p-6 max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold uppercase text-sm">EDITAR ARTÍCULO</h2>
            <form onSubmit={handleUpdateArticleSubmit} className="space-y-3">
              <div>
                <label className="text-neutral-400 block">TÍTULO</label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-400 block">SUBTÍTULO</label>
                <input
                  type="text"
                  value={editingArticle.subtitle}
                  onChange={(e) => setEditingArticle({ ...editingArticle, subtitle: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-400 block">SLUG</label>
                  <input
                    type="text"
                    value={editingArticle.slug}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block">CATEGORÍA</label>
                  <input
                    type="text"
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-neutral-400 block">CONTENIDO (MARKDOWN)</label>
                <textarea
                  rows={8}
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white font-sans text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-published"
                  checked={editingArticle.published}
                  onChange={(e) => setEditingArticle({ ...editingArticle, published: e.target.checked })}
                />
                <label htmlFor="edit-published" className="text-neutral-400 uppercase">PUBLICADO</label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-400 uppercase font-bold"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-white text-black font-bold uppercase"
                >
                  GUARDAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN TRACK */}
      {editingTrack && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 font-mono text-xs">
          <div className="bg-neutral-900 border border-neutral-700 p-6 max-w-lg w-full space-y-4">
            <h2 className="font-bold uppercase text-sm">EDITAR PLAYLIST</h2>
            <form onSubmit={handleUpdateTrackSubmit} className="space-y-3">
              <div>
                <label className="text-neutral-400 block">TÍTULO</label>
                <input
                  type="text"
                  value={editingTrack.title}
                  onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-400 block">DESCRIPCIÓN</label>
                <textarea
                  rows={3}
                  value={editingTrack.description}
                  onChange={(e) => setEditingTrack({ ...editingTrack, description: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-400 block">URL</label>
                <input
                  type="text"
                  value={editingTrack.url}
                  onChange={(e) => setEditingTrack({ ...editingTrack, url: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 p-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTrack(null)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-400 uppercase font-bold"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-white text-black font-bold uppercase"
                >
                  GUARDAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

