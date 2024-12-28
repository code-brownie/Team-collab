/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import { Link } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext";

const Project = () => {
    const [Projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useContext(AuthContext);

    // Fetch all the projects user is associated with
    const getProjects = async () => {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/users/getProjects?userId=${userId.id}`);
        const data = await response.json();

        if (response.ok) {
            setProjects(data.projects);
        } else {
            alert('Error fetching the Projects');
        }
        setLoading(false);
    }

    useEffect(() => {
        if (userId) {
            getProjects();
        }
    }, [userId]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Your Projects</h1>
                <Link className="flex items-center px-4 py-2 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-700" to="/create-project">
                    <span className="mr-2 text-lg">+</span> Create Project
                </Link>
            </div>

            {/* Loader */}
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin border-t-4 border-gray-800 border-solid rounded-full w-16 h-16"></div>
                </div>
            ) : (
                // Projects Grid
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {Projects && Projects.map((project, index) => (
                        <ProjectCard
                            key={index}
                            project={project}
                            team={project.Team}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Project;
