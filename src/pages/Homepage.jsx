import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";
import "../global.scss";

const Homepage = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRedirect = () => {
        navigate("/employeehomepage");
    };

    const fetchTasksByProject = async (project) => {
        setLoading(true);
        setError(null);

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                setError("User is not logged in.");
                setLoading(false);
                return;
            }

            const tasksCollection = collection(db, "Task_details");
            const q = query(
                tasksCollection,
                where("createdBy", "==", currentUser.email),
                where("project", "==", project),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setTasks([]);
            } else {
                const tasksData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTasks(tasksData);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setError("Failed to fetch tasks. Please try again.");
        }

        setLoading(false);
    };

    const handleProjectClick = (project, event) => {
        event.preventDefault();
        setSelectedProject(project);
        fetchTasksByProject(project);
    };

    return (
        <div className="container">
            <div className="hero-section">
                <h1>Welcome to Advent Global Solutions INC</h1>
                <p>
                    At Advent Global, we believe that digital assurance is the
                    foundation of this transformation.
                </p>
            </div>
            <div className="content-section">
                <div className="sidebar">
                    <h3>Navigation</h3>
                    <ul>
                        <li>
                            <a href="/MyProfile">My Profile</a>
                        </li>
                        <li>
                            <a href="/MyTasks">My Tasks</a>
                        </li>
                    </ul>
                    <h3>Projects</h3>
                    <ul>
                        <li>
                            <a
                                href="/"
                                onClick={(e) => handleProjectClick("Unity", e)}
                            >
                                Unity
                            </a>
                        </li>
                        <li>
                            <a
                                href="/"
                                onClick={(e) => handleProjectClick("SNR", e)}
                            >
                                SNR
                            </a>
                        </li>
                        <li>
                            <a
                                href="/"
                                onClick={(e) =>
                                    handleProjectClick("Heartbeat", e)
                                }
                            >
                                Heart Beat
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="main-content">
                    {selectedProject ? (
                        <div>
                            <h2>Tasks for Project: {selectedProject}</h2>
                            {loading && <p>Loading tasks...</p>}
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            {!loading && tasks.length === 0 && (
                                <p>No tasks found for this project.</p>
                            )}
                            {!loading && tasks.length > 0 && (
                                <table className="tasks-table">
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Status</th>
                                            <th>Due Date</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task) => (
                                            <tr key={task.id}>
                                                <td>{task.taskDetails}</td>
                                                <td>{task.status}</td>
                                                <td>
                                                    {new Date(
                                                        task.dueDate
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    {new Date(
                                                        task.createdAt.seconds *
                                                            1000
                                                    ).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ) : (
                        <div className="cta-card">
                            <h2>Add Tasks</h2>
                            <button onClick={handleRedirect}>
                                Click Here to Upload
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
