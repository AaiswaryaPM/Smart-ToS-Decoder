import Analysis from "../models/Analysis.js";
import ai from "../config/gemini.js";

// Helper function to keep only latest 20 analyses
const keepLatestAnalyses = async () => {
  try {
    const analyses = await Analysis.find()
      .sort({ createdAt: -1 })
      .select("_id")
      .lean();

    if (analyses.length <= 20) return;

    const oldIds = analyses.slice(20).map((item) => item._id);

    await Analysis.deleteMany({
      _id: { $in: oldIds },
    });
  } catch (error) {
    console.error("Cleanup Error:", error);
  }
};

// Analyze Terms & Conditions
export const analyzeTerms = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const prompt = `
You are a professional legal document analyzer and privacy expert.

Analyze Terms & Conditions and return ONLY valid JSON.

IMPORTANT RULES:
- Be realistic and avoid exaggeration.
- Big companies like Instagram, Google, WhatsApp are usually LOW to MEDIUM risk unless there are extreme clauses.
- Do NOT assume worst-case scenarios without evidence in the text.
- Base scoring ONLY on the actual content provided.
- Explain everything in SIMPLE ENGLISH that a non-lawyer can easily understand.

RETURN FORMAT:

{
  "summary": "A short explanation in simple English",
  "riskScore": number between 0 and 100,
  "riskSignals": [
    "EXACT word or phrase copied from one of the generated keyPoints (1-3 words only)"
  ],
  "keyPoints": [
    "Simple English point (max 10-12 words)",
    "Another simple English point",
    "Another simple English point"
  ],
  "permissions": [
    {
      "name": "Location",
      "status": "Detected",
      "reason": "Uses your location for nearby services."
    },
    {
      "name": "Camera",
      "status": "Not Mentioned",
      "reason": "No camera access found."
    }
  ]
}

SCORING RULES:
- 0–30 → Safe (normal apps like Instagram, YouTube, WhatsApp, Google)
- 31–60 → Moderate tracking, ads, analytics usage
- 61–80 → High risk (strong tracking, third-party sharing, data usage expansion)
- 81–100 → Extreme risk (selling data, legal waiver, user rights removal)

ADDITIONAL RULES:
- Write everything in SIMPLE ENGLISH.
- Avoid legal or technical words whenever possible.
- If a legal term must be used, explain it using simple words.
- keyPoints must be concise (maximum 10–12 words each).
- Do NOT copy long text from the input.
- Do NOT include full legal clauses.
- Focus only on the most important information.

IMPORTANT RULES FOR riskSignals:
- Every riskSignal MUST appear EXACTLY inside at least one generated keyPoint.
- Do NOT invent new words or phrases.
- Do NOT paraphrase.
- Each riskSignal must contain only 1-3 words.
- Return only genuinely risky words or phrases.

PERMISSION DETECTION RULES

Check whether the Terms mention or imply use of:

- Location
- Camera
- Microphone
- Contacts
- Photos
- Storage
- Notifications
- Bluetooth
- Calendar
- SMS
- Phone Number
- Email
- Payment Information

For each permission return:

{
"name":"Location",
"status":"Detected | Possible | Not Mentioned",
"reason":"Very short explanation."
}

Detected = clearly stated

Possible = implied

Not Mentioned = absent

Never invent permissions that are unsupported by the text.

Example:

keyPoints:
[
  "Collects personal data",
  "Shares data with advertisers",
  "Stores your location history",
  "You can delete your account"
]

riskSignals:
[
  "personal data",
  "advertisers",
  "location history"
]

TEXT:
${text}
`;

    const normalizeRiskScore = (score, text) => {
      let finalScore = Number(score || 0);

      const lowerText = text.toLowerCase();

      // BIG COMPANY PROTECTION (VERY IMPORTANT)
      const safeApps = [
        "instagram",
        "meta",
        "facebook",
        "google",
        "youtube",
        "whatsapp",
        "twitter",
        "x.com"
      ];

      const isSafeApp = safeApps.some(app =>
        lowerText.includes(app)
      );

      if (isSafeApp) {
        // cap risk for major platforms
        if (finalScore > 60) {
          finalScore = 35 + Math.random() * 10; // 35–45 range
        }
      }

      // clamp values
      if (finalScore < 0) finalScore = 0;
      if (finalScore > 100) finalScore = 100;

      return Math.round(finalScore);
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const resultText = response.text;

    const cleaned = resultText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(cleaned);

    analysis.permissions = analysis.permissions || [];

    const rawScore = analysis.riskScore;

    const safeScore = normalizeRiskScore(rawScore, text);

    const savedAnalysis = await Analysis.create({
      originalText: text,
      summary: analysis.summary,
      riskScore: safeScore,
      riskSignals: analysis.riskSignals || [],
      keyPoints: analysis.keyPoints || [],
      permissions: analysis.permissions
    });

    // Auto-delete old records
    await keepLatestAnalyses();

    return res.status(200).json({
      success: true,
      data: savedAnalysis,
    });
  } catch (error) {
    console.error("Analysis Error:", error);

    return res.status(500).json({
      success: false,
      message: "Analysis failed",
    });
  }
};

// Get latest 20 analyses
export const getHistory = async (req, res) => {
  try {
    const history = await Analysis.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({
      success: true,
      data: history,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// Delete one history item
export const deleteHistoryItem = async (req, res) => {
  try {
    const deletedItem = await Analysis.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear all history
export const clearHistory = async (req, res) => {
  try {
    await Analysis.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "History cleared",
    });
  } catch (error) {
    console.error("Clear History Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};