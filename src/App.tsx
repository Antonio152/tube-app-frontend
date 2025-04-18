import React, { useState } from 'react';
import axios from 'axios';
import styles from "./styles/App.module.scss"

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        'https://tube-app-backend.netlify.app/.netlify/functions/download', //https://tube-app-backend.netlify.app/.netlify/functions/download
        {
          params: { url },
          responseType: "blob", // Para descargar como archivo
        }
      );

      // Crear link para descarga
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "video.mp4"; // o .mp3 según tu backend
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError("Ocurrió un error al descargar el video.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* Main container */}
      <div className={styles.mainContainer}>
        <h1>Descargar videos 👻</h1>
        <input 
          type="text" 
          name="link" 
          placeholder='Ingresa el link del video...' 
          id="" 
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleDownload}>{loading ? "Descargando..." : "Descargar"}</button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </>
  )
}

export default App
