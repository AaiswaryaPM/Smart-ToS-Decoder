import { useState } from "react";

function InputForm({ onAnalyze }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      alert("Please enter Terms & Conditions text.");
      return;
    }

    onAnalyze(text);
  };

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <textarea
        rows="10"
        placeholder="Paste Terms & Conditions here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="submit">
        Analyze Terms
      </button>
    </form>
  );
}

export default InputForm;