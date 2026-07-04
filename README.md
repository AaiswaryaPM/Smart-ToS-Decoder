# 🤖 Smart ToS Decoder

An AI-powered web application that simplifies complex **Terms of Service (ToS)** documents by providing concise summaries, highlighting potential risks, and enabling users to chat with uploaded documents using **Retrieval-Augmented Generation (RAG)**.

---

## 📌 Overview

Terms and Conditions documents are often lengthy, difficult to understand, and rarely read by users. Smart ToS Decoder leverages Generative AI and semantic search to analyze legal documents, identify important clauses, calculate a risk score, and answer user questions in natural language.

The project supports both **direct text analysis** and **document-based conversational AI**, making legal documents more accessible and easier to understand.

---

# ✨ Features

## 📄 Terms & Conditions Analysis

- Paste any Terms & Conditions or Privacy Policy.
- AI-generated concise summary.
- Automatic risk score calculation.
- Highlights risky or suspicious clauses.
- Stores previous analyses in history.

## 🤖 Chat with Documents (RAG)

- Upload PDF documents.
- Upload DOCX documents.
- Automatic text extraction.
- Intelligent text chunking.
- Embedding generation using Gemini.
- Semantic search over document chunks.
- AI-powered question answering using retrieved context.

## 📊 Upload Progress Tracking

- Real-time upload progress.
- Backend processing progress.
- Loading spinner during embedding generation.
- Status updates for every processing stage.

## 📚 History Management

- Save previous analyses.
- Search history.
- Delete individual history entries.
- Clear all history.

## 📱 Responsive UI

- Mobile-friendly interface.
- Desktop and mobile navigation.
- Sliding history drawer.
- Auto-scroll to latest chat message.

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Axios
- CSS3
- Lucide React Icons

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- Server-Sent Events (SSE)

## AI & NLP

- Google Gemini API
- Gemini Embeddings
- Retrieval-Augmented Generation (RAG)

---

# 📂 Project Structure

```text
smart-tos-decoder/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── uploads/
│   ├── utils/
│   └── package.json
│
└── README.md
```

---

# ⚙️ Workflow

## 1. Terms & Conditions Analysis

```text
User
   ↓
Paste ToS
   ↓
Frontend
   ↓
Express API
   ↓
Gemini AI
   ↓
Summary + Risk Score + Highlights
   ↓
MongoDB
   ↓
Frontend Result
```

---

## 2. Document Chat (RAG)

```text
Upload PDF/DOCX
       ↓
Backend
       ↓
Extract Text
       ↓
Split into Chunks
       ↓
Generate Embeddings
       ↓
Store in MongoDB
       ↓
User Question
       ↓
Generate Question Embedding
       ↓
Semantic Search
       ↓
Relevant Chunks
       ↓
Gemini AI
       ↓
Final Answer
```

---

# 🗄 Database Collections

## Documents

Stores uploaded document metadata.

Example fields:

- filename
- originalName
- fileType
- totalChunks

---

## Chunks

Stores every document chunk along with its embedding.

Example fields:

- documentId
- documentName
- chunkIndex
- text
- embedding

---

## Analysis History

Stores previous ToS analyses.

Example fields:

- summary
- riskScore
- riskyClauses
- createdAt

---

# 🌐 Deployment

## Frontend

- Vercel

## Backend

- Render

## Database

- MongoDB Atlas

---

# 🎯 Future Improvements

- OCR support for scanned PDFs.
- Multi-document chat.
- Authentication and user accounts.
- Export analysis as PDF.
- Clause comparison between documents.
- Multi-language support.
- Streaming AI responses.
- Voice-based document queries.

---

# 👩‍💻 Author

**Aaiswarya PM**

Aspiring Full Stack Developer | Java | MERN Stack | AI Applications

---

# 📄 License

This project is developed for learning, internship, and portfolio purposes.