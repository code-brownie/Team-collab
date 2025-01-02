/* eslint-disable react/prop-types */
import { File as FileIcon, Trash2, Download } from 'lucide-react';

const FileList = ({ files, onDelete, formatFileSize, formatDate, users, currentUser }) => {
    const findUploaderName = (uploaderId) => {
        const uploader = users.filter((user) => uploaderId == user.id);
        return uploader ? uploader[0].name : 'Unknown';
    };
    return (
        <div className="space-y-4">
            {files.map((file) => (
                <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded">
                            <FileIcon className="h-6 w-6 text-gray-900" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-800">{file.fileName}</h3>
                            <div className="flex space-x-4 text-sm text-gray-500">
                                <span>{formatFileSize(file.fileSize)}</span>
                                <span>•</span>
                                <span>{formatDate(file.createdAt)}</span>
                                <span>•</span>
                                <span>
                                    Uploaded by:{' '}
                                    {file.uploadedBy === currentUser
                                        ? 'You'
                                        : findUploaderName(file.uploadedBy)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <a
                            href={file.cloudinaryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <Download className="h-5 w-5 text-gray-600" />
                        </a>
                        <button
                            onClick={() => onDelete(file.id)}
                            className="p-2 hover:bg-red-100 rounded-full transition-colors"
                        >
                            <Trash2 className="h-5 w-5 text-red-600" />
                        </button>
                    </div>
                </div>
            ))}

            {files.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No files uploaded yet
                </div>
            )}
        </div>
    );
};

export default FileList;
