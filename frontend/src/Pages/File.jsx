import { useState, useEffect, useContext } from 'react';
import { Plus } from 'lucide-react';
import FileList from '../components/FileList'
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

const FileManagement = () => {
    const { toast } = useToast();
    const [project, setProject] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [teamId, setTeamId] = useState(null);
    const { id } = useParams();
    const { userId } = useContext(AuthContext);
    useEffect(() => {
        if (userId && id) {
            // console.log(userId.id);
            fetchProject();
        }
        if (userId && teamId) {
            console.log('t', teamId);
            fetchFiles();
        }
    }, [teamId, id, userId]);

    const fetchFiles = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/files/getFile/team/${teamId}`);
            if (!response.ok) throw new Error('Failed to fetch files');
            const data = await response.json();
            console.log('data', data);
            setFiles(data);
        } catch (err) {
            setError('Failed to fetch files');
            console.error('Fetch error:', err);
        }
    };

    const fetchProject = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/project/getOne?projectId=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                throw new Error('Error fetching project');
            }
            setProject(data.project);
            setTeamId(data.project.teamId);
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleFileUpload = async () => {
        if (!selectedFile) {
            toast({
                title: "Please select a file",
                variant: 'destructive'
            });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('teamId', teamId);
            formData.append('userId', userId.id);

            const response = await fetch('http://localhost:3000/api/files/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload file');
            const data = await response.json();
            setFiles((prev) => [...prev, data]);
            setShowUploadModal(false);
            setSelectedFile(null);
        } catch (err) {
            toast({
                title: 'Try again',
                description: 'Failed to upload the file',
                variant: 'destructive'
            })
            setError('Failed to upload file');
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (fileId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/files/delete/${fileId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete file');
            setFiles((files) => files.filter((file) => file.id !== fileId));
        } catch (err) {
            setError('Failed to delete file');
            console.error('Delete error:', err);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Team Files</h2>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Upload File
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm md:text-base">
                    {error}
                </div>
            )}

            {teamId && <FileList
                files={files}
                onDelete={handleDelete}
                formatFileSize={formatFileSize}
                formatDate={formatDate}
                users={project.Team?.Users}
                currentUser={userId.id}
            />}

            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Upload File</h3>
                        <input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            className="w-full p-2 border rounded text-sm md:text-base"
                        />
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                }}
                                className="px-3 md:px-4 py-2 text-sm md:text-base text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFileUpload}
                                className="px-3 md:px-4 py-2 text-sm md:text-base bg-gray-900 text-white rounded hover:bg-gray-700"
                                disabled={loading || !selectedFile}
                            >
                                {loading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileManagement;
