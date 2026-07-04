import fs from "fs/promises";
import pdfParse from "pdf-parse";

const extractTextFromPDF = async (filePath) => {
  const dataBuffer = await fs.readFile(filePath);

  const data = await pdfParse(dataBuffer);

  return data.text;
};

export default extractTextFromPDF;