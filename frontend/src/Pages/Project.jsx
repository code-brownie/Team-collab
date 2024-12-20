/* eslint-disable no-unused-vars */
import React from 'react'
import { dummyProjects } from '../data/DummyProjects'
import ProjectCard from '../components/ProjectCard'
import { Link } from 'react-router-dom'
const Project = () => {
    return (

        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Your Projects</h1>
                <Link className="flex items-center px-4 py-2 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-700" to="/create-team">
                    <span className="mr-2 text-lg">+</span> Create Project
                </Link>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {dummyProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        team={project.team}
                    />
                ))}
            </div>
        </div>
    )
}

export default Project