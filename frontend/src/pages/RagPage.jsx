import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import UploadDocument from "../components/UploadDocument";
import ChatBox from "../components/ChatBox";

function RagPage({ onBack }) {
  const [documentInfo, setDocumentInfo] = useState(null);

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

        <h1>Chat with Document</h1>

      </div>

      {/* CONTENT */}

      <div className="center-container">

        {!documentInfo ? (

          <UploadDocument
            onUploadSuccess={(data) => {

              setDocumentInfo({
                documentId: data.documentId,
                documentName: data.filename,
              });

            }}
          />

        ) : (

          <ChatBox
            documentId={documentInfo.documentId}
            documentName={documentInfo.documentName}
          />

        )}

      </div>

    </div>
  );
}

export default RagPage;