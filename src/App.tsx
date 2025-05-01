import React, { useState } from 'react';
import axios from 'axios';
import styles from "./styles/App.module.scss"

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [format, setFormat] = useState("mp4");

  /* This function is for serverless  */
  const handleDownload = async () => {
    setError("");
    setLoading(true);
    // Serverless netlify function
    //https://tube-app-backend.netlify.app/.netlify/functions/serverless_netlify
    try {
      const response = await axios.get(
        'https://tube-app-backend.netlify.app/.netlify/functions/download_v2', //'http://localhost:8888/.netlify/functions/serverless_netlify
        {
          params: { url, format },
          responseType: "blob",
        }
      );
  
      // Obtener el nombre desde Content-Disposition
      const contentDisposition = response.headers['content-disposition'];
       
      console.log(response)
      let filename = contentDisposition || "video.mp4";
  
      const match = contentDisposition?.match(/filename="(.+?)"/);
      if (match && match[1]) {
        filename = match[1];
      }
  
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
  
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
        <div>
          <select onChange={(e) => setFormat(e.target.value)} value={format}>
            <option value="mp4">MP4</option>
            <option value="mp3">MP3</option>
          </select>
        </div>
        <button onClick={handleDownload}>{loading ? "Descargando..." : "Descargar"}</button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </>
  )
}

export default App
