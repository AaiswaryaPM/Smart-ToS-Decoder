function HomePage({ onSelect }) {
  return (
    <div className="home-page">

      <h1 className="home-title">
        Smart ToS Decoder
      </h1>

      <p className="home-subtitle">
        Choose how you want to use the application
      </p>

      <div className="home-options">

        <div
          className="option-card"
          onClick={() => onSelect("paste")}
        >
          <div className="option-icon">
            📄
          </div>

          <h2>Paste Terms & Conditions</h2>

          <p>
            Paste any Terms & Conditions and get
            AI-powered analysis, trust score,
            recommendations and permission detection.
          </p>
        </div>

        <div
          className="option-card"
          onClick={() => onSelect("upload")}
        >
          <div className="option-icon">
            📂
          </div>

          <h2>Upload Document</h2>

          <p>
            Upload a PDF or DOCX and chat with
            your document using RAG + Gemini AI.
          </p>
        </div>

      </div>

    </div>
  );
}

export default HomePage;