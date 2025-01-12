/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { AuthContext } from "../context/AuthContext";
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Project = () => {
    const [Projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useContext(AuthContext);
    const { toast } = useToast();

    const getProjects = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/users/getProjects?userId=${userId.id}`);
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
                    <div className="animate-spin border-t-4 border-gray-800 border-solid rounded-full w-12 h-12 sm:w-16 sm:h-16"></div>
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
