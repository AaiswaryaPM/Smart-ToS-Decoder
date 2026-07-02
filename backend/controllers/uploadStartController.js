import Document from "../models/Document.js";

const uploadStart = async (req, res) => {

    try {

        const document = await Document.create({

            fileName: "processing",

            originalName: "processing",

            fileType: "processing"

        });

        res.json({

            success: true,

            documentId: document._id

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export default uploadStart;