import {
  useState,
  useMemo,
  memo,
} from "react";

import API from "../services/api";

const HistoryItem = memo(
  ({
    item,
    deleteItem,
    onSelectAnalysis,
  }) => {

    const score = item.riskScore ?? 0;

    const getRiskClass = () => {
      if (score <= 30) return "low";
      if (score <= 60) return "medium";
      if (score <= 80) return "high";
      return "very-high";
    };

    return (
      <div className="history-item">

        <div
          className="history-content"
          onClick={() =>
            onSelectAnalysis(item)
          }
        >

          <span
            className={`risk-badge ${getRiskClass()}`}
          >
            {score}%
          </span>

          <p>
            {(item.summary || "").length > 80
              ? item.summary.slice(0, 80) +
                "..."
              : item.summary}
          </p>

        </div>

        <button
          className="delete-btn"
          onClick={() =>
            deleteItem(item._id)
          }
        >
          ✕
        </button>

      </div>
    );
  }
);

function History({
  history,
  setHistory,
  onSelectAnalysis,
}) {

  const [search, setSearch] =
    useState("");

  const filteredHistory =
    useMemo(() => {

      return history.filter((item) =>
        (item.summary || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    }, [history, search]);

  const deleteItem = async (id) => {

    try {

      await API.delete(`/history/${id}`);

      setHistory((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

    } catch (error) {
      console.error(error);
    }

  };

  const clearAll = async () => {

    if (
      !window.confirm(
        "Delete all history?"
      )
    )
      return;

    try {

      await API.delete("/history");

      setHistory([]);

    } catch (error) {
      console.error(error);
    }

  };

  return (

    <div className="history-panel">

      <div className="history-controls">

        <div className="search-wrapper">

          <input
            type="text"
            placeholder="🔍 Search analyses..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <button
          className="clear-btn"
          onClick={clearAll}
        >
          Clear
        </button>

      </div>

      <div className="history-list">

        {filteredHistory.length === 0 ? (

          <p>No analyses found.</p>

        ) : (

          filteredHistory.map((item) => (

            <HistoryItem
              key={item._id}
              item={item}
              deleteItem={deleteItem}
              onSelectAnalysis={
                onSelectAnalysis
              }
            />

          ))

        )}

      </div>

    </div>

  );
}

export default History;