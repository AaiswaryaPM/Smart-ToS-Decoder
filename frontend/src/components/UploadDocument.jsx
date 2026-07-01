import { useState } from "react";
import API from "../services/api";

function UploadDocument({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);

    try {
      setUploading(true);

      const res = await API.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUploadSuccess({
        documentId: res.data.documentId,
        filename: res.data.filename,
      });

      alert("Document uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
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

    </div>
  );
}

export default UploadDocument;