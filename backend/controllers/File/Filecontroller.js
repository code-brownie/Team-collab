const cloudinary = require('../../config/cloudinary');
const File = require('../../models/File');

const uploadFile = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const { file } = req.files;
        const { teamId } = req.body;
        const {userId} = req.body;
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto',
            folder: `team-${teamId}`
        });

        // Create file record in database
        const fileRecord = await File.create({
            fileName: file.name,
            fileType: file.mimetype,
            fileSize: file.size,
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            uploadedBy: userId,
            teamId
        });

        res.status(200).json(fileRecord);
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
};

const getTeamFiles = async (req, res) => {
    try {
        const { teamId } = req.params;

        const files = await File.findAll({
            where: { teamId },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch files' });
    }
};

const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const file = await File.findByPk(fileId);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(file.cloudinaryPublicId);

        // Delete from database
        await file.destroy();

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete file' });
    }
};

module.exports = {
    uploadFile,
    getTeamFiles,
    deleteFile
};