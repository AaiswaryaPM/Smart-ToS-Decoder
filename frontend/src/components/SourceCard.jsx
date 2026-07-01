function SourceCard({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="sources-container">

      <h4>📚 Retrieved Chunks</h4>

      {sources.map((source, index) => (

        <div
          key={index}
          className="source-card"
        >

          <div className="source-score">
            Similarity Score:
            <strong>
              {" "}
              {(source.score * 100).toFixed(2)}%
            </strong>
          </div>

          <div className="source-text">
            {source.text}
          </div>

        </div>

      ))}

    </div>
  );
}

export default SourceCard;