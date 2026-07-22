"use client";

import { useState, useEffect } from "react";
import SubpageHeader from "@/components/SubpageHeader";
import { loginAdmin, uploadPhoto, createArticle, createTrack } from "./services";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  // Pestañas del dashboard
  const [activeTab, setActiveTab] = useState<"photos" | "articles" | "tracks">("photos");

  // Estados de formularios
  const [photoForm, setPhotoForm] = useState({
    title: "",
    category: "Nocturna",
    location: "",
    aspectRatio: "aspect-[4/5]",
    year: "2026",
    date: new Date().toISOString().split("T")[0],
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [articleForm, setArticleForm] = useState({
    title: "",
    subtitle: "",
    slug: "",
    content: "",
    category: "AI",
    published: false,
  });

  const [trackForm, setTrackForm] = useState({
    id: "",
    title: "",
    description: "",
    url: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  // Verificar si ya hay una sesión guardada al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(email, password);
      localStorage.setItem("admin_token", data.idToken);
      setToken(data.idToken);
      setIsLoggedIn(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
    setIsLoggedIn(false);
  };

  // Subir Foto
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al subir la fotografía.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Crear Artículo
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar el artículo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Agregar playlist de Spotify
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await createTrack(token, trackForm);
      setSuccessMessage("¡Playlist añadida a la radio de PostgreSQL con éxito!");
      setTrackForm({
        id: "",
        title: "",
        description: "",
        url: "",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar la playlist.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // VISTA 1: Formulario de Login
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

      {/* Tabs */}
      <div className="flex border-b border-neutral-300 dark:border-neutral-800 gap-4 font-mono text-xs sm:text-sm">
        <button
          onClick={() => { setActiveTab("photos"); setError(""); setSuccessMessage(""); }}
          className={`pb-2 px-2 transition-all ${
            activeTab === "photos"
              ? "font-bold border-b-2 border-black dark:border-white text-black dark:text-white"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          SUBIR FOTO
        </button>
        <button
          onClick={() => { setActiveTab("articles"); setError(""); setSuccessMessage(""); }}
          className={`pb-2 px-2 transition-all ${
            activeTab === "articles"
              ? "font-bold border-b-2 border-black dark:border-white text-black dark:text-white"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          CREAR ARTÍCULO
        </button>
        <button
          onClick={() => { setActiveTab("tracks"); setError(""); setSuccessMessage(""); }}
          className={`pb-2 px-2 transition-all ${
            activeTab === "tracks"
              ? "font-bold border-b-2 border-black dark:border-white text-black dark:text-white"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          AÑADIR PLAYLIST
        </button>
      </div>

      {/* CONTENIDO DE PESTAÑAS */}
      <div className="bg-neutral-50 dark:bg-neutral-950 p-6 border border-neutral-200 dark:border-neutral-900 rounded-none shadow-sm">
        {/* PESTAÑA A: SUBIR FOTOS */}
        {activeTab === "photos" && (
          <form onSubmit={handlePhotoSubmit} className="space-y-4 font-mono text-xs">
            <h2 className="text-sm font-bold uppercase mb-2">// DETALLES DE LA FOTOGRAFÍA</h2>

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
                <select
                  value={photoForm.category}
                  onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                >
                  <option value="Nocturna">Nocturna</option>
                  <option value="Arquitectura">Arquitectura</option>
                  <option value="Naturaleza">Naturaleza</option>
                  <option value="Retrato">Retrato</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 block">UBICACIÓN / LUGAR</label>
                <input
                  type="text"
                  required
                  value={photoForm.location}
                  onChange={(e) => setPhotoForm({ ...photoForm, location: e.target.value })}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                  placeholder="Ej: Páramo de Sumapaz, Colombia"
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
              <label className="text-neutral-500 block">ARCHIVO DE IMAGEN (SUBIDA DIRECTA A S3)</label>
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
              {loading ? "SUBIENDO FOTO A AWS..." : "REGISTRAR Y SUBIR FOTO"}
            </button>
          </form>
        )}

        {/* PESTAÑA B: CREAR ARTÍCULOS */}
        {activeTab === "articles" && (
          <form onSubmit={handleArticleSubmit} className="space-y-4 font-mono text-xs">
            <h2 className="text-sm font-bold uppercase mb-2">// NUEVO ESCRITO / ARTÍCULO</h2>

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
              <label className="text-neutral-500 block">CONTENIDO (SOPORTA MARKDOWN)</label>
              <textarea
                required
                rows={10}
                value={articleForm.content}
                onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none font-sans"
                placeholder="# Título Principal&#10;&#10;Escribe tu contenido aquí en Markdown..."
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
        )}

        {/* PESTAÑA C: AGREGAR CANCIONES */}
        {activeTab === "tracks" && (
          <form onSubmit={handleTrackSubmit} className="space-y-4 font-mono text-xs">
            <h2 className="text-sm font-bold uppercase mb-2">// AGREGAR PLAYLIST DE SPOTIFY A LA RADIO</h2>

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
              <label className="text-neutral-500 block">DESCRIPCIÓN DE LA PLAYLIST</label>
              <textarea
                required
                rows={3}
                value={trackForm.description}
                onChange={(e) => setTrackForm({ ...trackForm, description: e.target.value })}
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-2 text-black dark:text-white focus:outline-none"
                placeholder="Ej: Selección de barras puras, ritmos pesados..."
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
                placeholder="Ej: https://open.spotify.com/playlist/1iQ2ovIssKp5YiXMpKJJ1Q"
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
        )}
      </div>
    </div>
  );
}
