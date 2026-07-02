import { useState } from "react";
import API from "../services/api";

function UploadDocument({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);

    try {

      setUploading(true);
      setProcessing(false);
      setProgress(0);
      setStage("Preparing upload...");

      const startRes = await API.post("/upload/start");
      const documentId = startRes.data.documentId;
      const backendURL = API.defaults.baseURL.replace("/api", "");
      const eventSource = new EventSource(
        `${backendURL}/api/progress/${documentId}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setProcessing(true);
        setUploading(false);
        setProgress(data.percent);
        setStage(data.stage);
        if (data.completed) {
          eventSource.close();
          setProcessing(false);
          alert("Document uploaded successfully!");
        }
      };
      eventSource.onerror = () => {
        eventSource.close();
      };
      const uploadRes = await API.post(
        `/upload/process/${documentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) /
                progressEvent.total
              );
              setProgress(percent);
            }
          },
        }
      );

      onUploadSuccess({
        documentId,
        filename: uploadRes.data.filename,
      });
    }
    catch (err) {
      console.error(err);
      setUploading(false);
      setProcessing(false);
      alert("Upload failed");
    }
  };

  return (
    <div className="upload-container">

      <h2>📄 Chat with Your Document</h2>

      <label className="upload-btn">

        {uploading ? "Uploading..." : "Upload PDF / DOCX"}

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          hidden
          onChange={handleFileChange}
        />

      </label>

      {uploading && (
        <div className="upload-progress">
          <p>Uploading Document</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${progress}%`}}></div>
          </div>
          <span>{progress}</span>
        </div>
      )}

      {processing && (
        <div className="processing">

          <div className="spinner"></div>

          <div className="processing-content">

            <p 
            className={`upload-stage ${
            stage.includes("Reading")
              ? "reading"
              : stage.includes("Splitting")
              ? "splitting"
              : stage.includes("Generating")
              ? "embedding"
              : stage.includes("Saving")
              ? "saving"
              : stage.includes("Completed")
              ? "completed"
              : ""
          }`}>{stage}</p>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />

            </div>

            <span>{progress}%</span>

          </div>

        </div>
      )}

    </div>
  );
}

export default UploadDocument;