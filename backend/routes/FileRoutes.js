const express = require('express');
const router = express.Router();
const FileController = require('../controllers/File/Filecontroller');
const { uploadFile, getTeamFiles, deleteFile } = FileController;
router.post('/upload', uploadFile);
router.get('/getFile/team/:teamId', getTeamFiles);
router.delete('/delete/:fileId', deleteFile);

module.exports = router;