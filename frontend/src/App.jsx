import { useState } from "react";

import HomePage from "./pages/HomePage";
import PastePage from "./pages/PastePage";
import RagPage from "./pages/RagPage";

function App() {

  const [page, setPage] = useState("home");

  return (
    <>

      {page === "home" && (
        <HomePage
          onSelect={setPage}
        />
      )}

      {page === "paste" && (
        <PastePage
          onBack={() => setPage("home")}
        />
      )}

      {page === "upload" && (
        <RagPage
          onBack={() => setPage("home")}
        />
      )}

    </>
  );

}

export default App;