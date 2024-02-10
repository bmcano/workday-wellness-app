import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import "../App.css";

const fetchUserData = () => {
    return Promise.resolve({
        name: "John Doe",
        email: "john.doe@example.com",
        profilePic: "https://example.com/profile.jpg", // Placeholder image URL
        bio: "Software Engineer with a passion for web development and open source.",
        location: "San Francisco, CA",
        skills: ["JavaScript", "React", "Node.js", "TypeScript"],
        education: [
            {
                school: "University of Technology",
                degree: "Bachelor of Science in Computer Science",
                year: 2020,
            },
            {
                school: "Online Courses",
                degree: "Various Certifications",
                year: 2021,
            },
        ],
        social: {
            github: "https://github.com/johndoe",
            linkedin: "https://linkedin.com/in/johndoe",
        },
    });
};

type UserData = {
    name: string;
    email: string;
    profilePic: string;
    bio: string;
    location: string;
    skills: string[];
    education: {
        school: string;
        degree: string;
        year: number;
    }[];
    social: {
        github: string;
        linkedin: string;
    };
};

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        AuthorizedUser(navigate)
        fetchUserData().then(setUser);
    }, [navigate]);

    return (
        <React.Fragment>
            <Navbar />
            <div className="profile-container">
                <h1>Profile Page</h1>
                {user ? (
                    <div className="profile-details">
                        <img src={user.profilePic} alt="Profile" className="profile-picture" />
                        <h2>{user.name}</h2>
                        <p>Email: {user.email}</p>
                        <p>Bio: {user.bio}</p>
                        <p>Location: {user.location}</p>
                        <h3>Skills</h3>
                        <ul>
                            {user.skills.map(skill => (
                                <li key={skill}>{skill}</li>
                            ))}
                        </ul>
                        <h3>Education</h3>
                        {user.education.map(edu => (
                            <div key={edu.school}>
                                <p>School: {edu.school}</p>
                                <p>Degree: {edu.degree}</p>
                                <p>Year: {edu.year}</p>
                            </div>
                        ))}
                        <div className="social-links">
                            <a href={user.social.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                            <a href={user.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        </div>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
        </React.Fragment>
    );
};

export default Profile;