/* eslint-disable react/prop-types */
import { File as FileIcon, Trash2, Download } from 'lucide-react';

const FileList = ({ files, onDelete, formatFileSize, formatDate, users, currentUser }) => {
    const findUploaderName = (uploaderId) => {
        const uploader = users?.filter((user) => uploaderId == user.id);
        return uploader?.[0]?.name || 'Unknown';
    };

    return (
        <div className="space-y-4">
            {files.map((file) => (
                <div
                    key={file.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4"
                >
                    <div className="flex items-start sm:items-center space-x-3 md:space-x-4">
                        <div className="p-2 bg-blue-100 rounded shrink-0">
                            <FileIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-medium text-gray-800 text-sm md:text-base truncate">
                                {file.fileName}
                            </h3>
                            <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                                <span>{formatFileSize(file.fileSize)}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{formatDate(file.createdAt)}</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="truncate">
                                    Uploaded by:{' '}
                                    {file.uploadedBy === currentUser
                                        ? 'You'
                                        : findUploaderName(file.uploadedBy)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 ml-auto sm:ml-0">
                        <a
                            href={file.cloudinaryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 md:p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <Download className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                        </a>
                        <button
                            onClick={() => onDelete(file.id)}
                            className="p-1.5 md:p-2 hover:bg-red-100 rounded-full transition-colors"
                        >
                            <Trash2 className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                        </button>
                    </div>
                </div>
            ))}

            {files.length === 0 && (
                <div className="text-center py-8 md:py-12 text-sm md:text-base text-gray-500">
                    No files uploaded yet
                </div>
            )}
        </div>
    );
};

export default FileList;