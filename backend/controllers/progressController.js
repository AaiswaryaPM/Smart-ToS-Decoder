import { getProgress } from "../utils/progressStore.js";

export const streamProgress = (req, res) => {
    const { documentId } = req.params;
    
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "Keep-alive");

    const interval = setInterval(() => {
        const progress = getProgress(documentId);
        if (progress){
            res.write(`data: ${JSON.stringify(progress)}\n\n`);
            if(progress.completed){
                clearInterval(interval);
                res.end();
            }
        }
    }, 500);

    req.on("close", () => {
        clearInterval(interval);
    });
};