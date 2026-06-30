import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    originalText: String,
    summary: String,
    riskScore: {
      type: Number,
      default: 0,
    },
    keyPoints: [String],
    riskSignals: [String],
    permissions:[
        {
            name:String,
            status:String,
            reason:String
        }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);