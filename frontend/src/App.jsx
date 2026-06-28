import { useEffect, useState } from "react";
import API from "./services/api";
import InputForm from "./components/InputForm";
import ResultCard from "./components/ResultCard";
import { Menu, X } from "lucide-react";
import History from "./components/History";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchHistory = async () => {
    const res = await API.get("/history");
    setHistory(res.data.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const analyzeText = async (text) => {
    setLoading(true);

    try {
      const res = await API.post("/analyze", { text });

      setResult(res.data.data);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const openHistoryItem = (item) => {
    setResult(item);
    setShowHistory(false);
  };

  return (
    <div className="app-wrapper">

      {/* HEADER */}
      <div className="top-bar">

        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        <h1>Smart ToS Decoder</h1>

        <button
          className="history-btn desktop-history"
          onClick={() => setShowHistory(true)}
        >
          📜 History
        </button>

      </div>

      {menuOpen && (
        <>
          <div
            className="mobile-overlay"
            onClick={() => setMenuOpen(false)}
          />

          <div className="mobile-menu">

            <div className="mobile-menu-header">

              <h2>Menu</h2>

              <button
                onClick={() => setMenuOpen(false)}
              >
                <X size={22} />
              </button>

            </div>

            <button
              className="mobile-menu-item"
              onClick={() => {
                setShowHistory(true);
                setMenuOpen(false);
              }}
            >
              📜 History
            </button>

          </div>
        </>
      )}

      {/* CENTER CONTENT */}
      <div className="center-container">

        <InputForm onAnalyze={analyzeText} />

        {loading && <p className="loading">Analyzing...</p>}

        <ResultCard result={result} />

      </div>

      {/* HISTORY DRAWER */}
      <div className={`drawer ${showHistory ? "open" : ""}`}>

        <div className="drawer-header">

          <h2>History</h2>

          <button
            className="drawer-close"
            onClick={() => setShowHistory(false)}
          >
            <X size={20} />
          </button>

        </div>

        <History
          history={history}
          setHistory={setHistory}
          onSelectAnalysis={openHistoryItem}
        />

      </div>

      {/* BACKDROP */}
      {showHistory && (
        <div
          className="backdrop"
          onClick={() => setShowHistory(false)}
        />
      )}

    </div>
  );
}

export default App;