import { useEffect, useState } from "react";
import API from "../services/api";
import InputForm from "../components/InputForm";
import ResultCard from "../components/ResultCard";
import History from "../components/History";
import { Menu, X, ArrowLeft } from "lucide-react";

function PastePage({ onBack }) {

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
      const res = await API.post("/analyze", {
        text,
      });

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
          className="back-btn"
          onClick={onBack}
        >
          <ArrowLeft size={22}/>
        </button>

        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={24}/>
        </button>

        <h1>Smart ToS Decoder</h1>

        <button
          className="history-btn desktop-history"
          onClick={() => setShowHistory(true)}
        >
          📜 History
        </button>

      </div>

      {/* MOBILE MENU */}

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
                <X size={22}/>
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

      {/* CONTENT */}

      <div className="center-container">

        <InputForm
          onAnalyze={analyzeText}
        />

        {loading && (

          <p className="loading">
            Analyzing...
          </p>

        )}

        <ResultCard
          result={result}
        />

      </div>

      {/* HISTORY */}

      <div
        className={`drawer ${showHistory ? "open" : ""}`}
      >

        <div className="drawer-header">

          <h2>History</h2>

          <button
            className="drawer-close"
            onClick={() => setShowHistory(false)}
          >
            <X size={20}/>
          </button>

        </div>

        <History
          history={history}
          setHistory={setHistory}
          onSelectAnalysis={openHistoryItem}
        />

      </div>

      {showHistory && (

        <div
          className="backdrop"
          onClick={() => setShowHistory(false)}
        />

      )}

    </div>
  );

}

export default PastePage;