/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { AuthContext } from "../context/AuthContext";
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import Spinner from '@/components/spinner';

const Project = () => {
    const [Projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useContext(AuthContext);
    const { toast } = useToast();
    const URL =
        import.meta.env.VITE_NODE_ENV === 'production'
            ? import.meta.env.VITE_API_BASE_URL_PROD
            : import.meta.env.VITE_API_BASE_URL_DEV;
    const getProjects = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${URL}/users/getProjects?userId=${userId.id}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to fetch the projects');
            }
            setProjects(data.projects);
        }
        catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch project data.",
                variant: "destructive",
            });
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log(URL);
        if (userId) {
            getProjects();
        }
    }, [userId]);
    return (
        <div className="p-3 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Your Projects</h1>
                <Link
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-700 transition-colors"
                    to="/create-project"
                >
                    <span className="mr-2 text-lg">+</span> Create Project
                </Link>
            </div>

            {/* Loader */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <Spinner height={70} width={70} color={'#000000'} />
                </div>
            ) : (
                // Projects Grid
                <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {Projects && Projects.map((project, index) => (
                        <ProjectCard
                            key={index}
                            project={project}
                            team={project.Team}
                        />
                    ))}
                    {Projects.length == 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-sm md:text-base">No Projects available! Create One</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Project;
