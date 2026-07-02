const progressMap = new Map();

export function setProgress(documentId, progress){
    progressMap.set(documentId, progress);
}

export function getProgress(documentId){
    return progressMap.get(documentId);
}

export function clearProgress(documentId){
    progressMap.delete(documentId);
}