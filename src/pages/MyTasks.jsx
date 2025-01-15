// import React, { useEffect, useState } from "react";
// import {
//     collection,
//     query,
//     where,
//     orderBy,
//     getDocs,
//     Timestamp,
//     doc,
//     getDoc,
//     updateDoc,
// } from "firebase/firestore";
// import { db } from "../config/firebase";
// import { getAuth } from "firebase/auth";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import "./mytasks.scss";

// const MyTasks = () => {
//     const [tasksInProgress, setTasksInProgress] = useState([]);
//     const [tasksCompleted, setTasksCompleted] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedTask, setSelectedTask] = useState(null);
//     const [editDetails, setEditDetails] = useState({
//         taskDetails: "",
//         status: "",
//         dueDate: "",
//         project: "",
//     });

//     const navigate = useNavigate(); // Initialize navigate

//     useEffect(() => {
//         const fetchTasks = async () => {
//             setLoading(true);
//             setError(null);

//             try {
//                 const auth = getAuth();
//                 const currentUser = auth.currentUser;

//                 if (!currentUser) {
//                     setError("User is not logged in.");
//                     setLoading(false);
//                     return;
//                 }

//                 const employeeRef = doc(db, "Employee-details", currentUser.uid);
//                 const employeeDoc = await getDoc(employeeRef);

//                 if (!employeeDoc.exists()) {
//                     setError("Employee information not found.");
//                     setLoading(false);
//                     return;
//                 }

//                 const employeeId = employeeDoc.data().Employee_id;

//                 const sevenDaysAgo = Timestamp.fromDate(
//                     new Date(new Date().setDate(new Date().getDate() - 7))
//                 );

//                 const tasksCollection = collection(db, "Task_details");
//                 const q = query(
//                     tasksCollection,
//                     where("employee_id", "==", employeeId),
//                     where("createdAt", ">=", sevenDaysAgo),
//                     orderBy("createdAt", "desc")
//                 );

//                 const querySnapshot = await getDocs(q);

//                 if (querySnapshot.empty) {
//                     setTasksInProgress([]);
//                     setTasksCompleted([]);
//                 } else {
//                     const tasksData = querySnapshot.docs.map((doc) => ({
//                         id: doc.id,
//                         ...doc.data(),
//                     }));

//                     setTasksInProgress(
//                         tasksData.filter((task) => task.status === "In Progress")
//                     );
//                     setTasksCompleted(
//                         tasksData.filter((task) => task.status === "Completed")
//                     );
//                 }
//             } catch (error) {
//                 setError("Failed to fetch tasks. Please try again.");
//             }

//             setLoading(false);
//         };

//         fetchTasks();
//     }, []);

//     const handleEdit = (task) => {
//         setSelectedTask(task);
//         setEditDetails({
//             taskDetails: task.taskDetails,
//             status: task.status,
//             dueDate: new Date(task.dueDate).toISOString().split("T")[0],
//             project: task.project || "Unknown",
//         });
//     };

//     const handleSave = async () => {
//         if (!editDetails.project) {
//             alert("Please select a valid project.");
//             return;
//         }

//         try {
//             const taskRef = doc(db, "Task_details", selectedTask.id);
//             await updateDoc(taskRef, {
//                 taskDetails: editDetails.taskDetails,
//                 status: editDetails.status,
//                 dueDate: editDetails.dueDate,
//                 project: editDetails.project,
//             });

//             alert("Task updated successfully!");
//             setSelectedTask(null);

//             setTasksInProgress((prevTasks) =>
//                 prevTasks.map((task) =>
//                     task.id === selectedTask.id ? { ...task, ...editDetails } : task
//                 )
//             );
//         } catch (error) {
//             alert("Failed to update task.");
//         }
//     };

//     const handleCancel = () => {
//         setSelectedTask(null);
//     };

//     // Add handleBack function to navigate to Homepage
//     const handleBack = () => {
//         navigate("/"); // This will navigate to the Homepage
//     };

//     return (
//         <div className="mytasks-container">
//             <h2>My Tasks</h2>
//             {/* Back Button */}
//             <button onClick={handleBack}>Back to Homepage</button>

//             {loading && <p>Loading tasks...</p>}
//             {error && <p style={{ color: "red" }}>{error}</p>}

//             <h3>In Progress Tasks</h3>
//             {tasksInProgress.length === 0 ? (
//                 <p>No tasks in progress.</p>
//             ) : (
//                 <table className="tasks-table">
//                     <thead>
//                         <tr>
//                             <th>Task</th>
//                             <th>Status</th>
//                             <th>Project</th>
//                             <th>Due Date</th>
//                             <th>Created At</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {tasksInProgress.map((task) => (
//                             <tr key={task.id}>
//                                 <td>{task.taskDetails}</td>
//                                 <td>{task.status}</td>
//                                 <td>{task.project}</td>
//                                 <td>{new Date(task.dueDate).toLocaleDateString()}</td>
//                                 <td>
//                                     {new Date(task.createdAt.seconds * 1000).toLocaleString()}
//                                 </td>
//                                 <td>
//                                     <button onClick={() => handleEdit(task)}>
//                                         Edit
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}

//             <h3>Completed Tasks (Last 7 Days)</h3>
//             {tasksCompleted.length === 0 ? (
//                 <p>No completed tasks in the last 7 days.</p>
//             ) : (
//                 <table className="tasks-table">
//                     <thead>
//                         <tr>
//                             <th>Task</th>
//                             <th>Status</th>
//                             <th>Project</th>
//                             <th>Due Date</th>
//                             <th>Created At</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {tasksCompleted.map((task) => (
//                             <tr key={task.id}>
//                                 <td>{task.taskDetails}</td>
//                                 <td>{task.status}</td>
//                                 <td>{task.project}</td>
//                                 <td>{new Date(task.dueDate).toLocaleDateString()}</td>
//                                 <td>
//                                     {new Date(task.createdAt.seconds * 1000).toLocaleString()}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}

//             {selectedTask && (
//                 <div className="edit-task-form">
//                     <h3>Edit Task</h3>
//                     <form
//                         onSubmit={(e) => {
//                             e.preventDefault();
//                             handleSave();
//                         }}
//                     >
//                         <div>
//                             <label>Task Details:</label>
//                             <textarea
//                                 value={editDetails.taskDetails}
//                                 onChange={(e) =>
//                                     setEditDetails((prev) => ({
//                                         ...prev,
//                                         taskDetails: e.target.value,
//                                     }))
//                                 }
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label>Status:</label>
//                             <select
//                                 value={editDetails.status}
//                                 onChange={(e) =>
//                                     setEditDetails((prev) => ({
//                                         ...prev,
//                                         status: e.target.value,
//                                     }))
//                                 }
//                                 required
//                             >
//                                 <option value="In Progress">In Progress</option>
//                                 <option value="Completed">Completed</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label>Project:</label>
//                             <select
//                                 value={editDetails.project}
//                                 onChange={(e) =>
//                                     setEditDetails((prev) => ({
//                                         ...prev,
//                                         project: e.target.value,
//                                     }))
//                                 }
//                                 required
//                             >
//                                 <option value="SNR">SNR</option>
//                                 <option value="Unity">Unity</option>
//                                 <option value="Heartbeat">Heartbeat</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label>Due Date:</label>
//                             <input
//                                 type="date"
//                                 value={editDetails.dueDate}
//                                 onChange={(e) =>
//                                     setEditDetails((prev) => ({
//                                         ...prev,
//                                         dueDate: e.target.value,
//                                     }))
//                                 }
//                                 required
//                             />
//                         </div>
//                         <button type="submit">Save</button>
//                         <button type="button" onClick={handleCancel}>
//                             Cancel
//                         </button>
//                     </form>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MyTasks;

import React, { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    Timestamp,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";
import "./mytasks.scss";

const MyTasks = () => {
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editDetails, setEditDetails] = useState({
        taskDetails: "",
        status: "",
        dueDate: "",
        project: "",
    });

    useEffect(() => {
        const fetchTasks = async () => {
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

                console.log("Current User UID:", currentUser.uid);

                const employeeRef = doc(
                    db,
                    "Employee-details",
                    currentUser.uid
                );
                const employeeDoc = await getDoc(employeeRef);

                if (!employeeDoc.exists()) {
                    setError("Employee information not found.");
                    setLoading(false);
                    return;
                }

                const employeeId = employeeDoc.data().Employee_id;
                console.log("Employee ID:", employeeId);

                const sevenDaysAgo = Timestamp.fromDate(
                    new Date(new Date().setDate(new Date().getDate() - 7))
                );

                const tasksCollection = collection(db, "Task_details");
                const q = query(
                    tasksCollection,
                    where("employee_id", "==", employeeId),
                    where("createdAt", ">=", sevenDaysAgo),
                    orderBy("createdAt", "desc")
                );

                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setTasksInProgress([]);
                    setTasksCompleted([]);
                    console.log("No tasks found in the last 7 days.");
                } else {
                    const tasksData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    console.log("Fetched Tasks Data:", tasksData);

                    setTasksInProgress(
                        tasksData.filter(
                            (task) => task.status === "In Progress"
                        )
                    );
                    setTasksCompleted(
                        tasksData.filter((task) => task.status === "Completed")
                    );
                    setFile(null);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setError("Failed to fetch tasks. Please try again.");
            }

            setLoading(false);
        };

        fetchTasks();
    }, []);

    const handleEdit = (task) => {
        setSelectedTask(task);
        setEditDetails({
            taskDetails: task.taskDetails,
            status: task.status,
            dueDate: new Date(task.dueDate).toISOString().split("T")[0],
            project: task.project || "Unknown",
        });
    };

    const handleSave = async () => {
        if (!editDetails.project) {
            alert("Please select a valid project.");
            return;
        }

        try {
            const taskRef = doc(db, "Task_details", selectedTask.id);
            await updateDoc(taskRef, {
                taskDetails: editDetails.taskDetails,
                status: editDetails.status,
                dueDate: editDetails.dueDate,
                project: editDetails.project,
            });

            alert("Task updated successfully!");
            setSelectedTask(null);

            // Update tasksInProgress
            setTasksInProgress((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === selectedTask.id
                        ? { ...task, ...editDetails }
                        : task
                )
            );
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task.");
        }
    };

    const handleCancel = () => {
        setSelectedTask(null);
    };

    return (
        <div className="mytasks-container">
            <h2>My Tasks</h2>
            {loading && <p>Loading tasks...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <h3>In Progress Tasks</h3>
            {tasksInProgress.length === 0 ? (
                <p>No tasks in progress.</p>
            ) : (
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Status</th>
                            <th>Project</th>
                            <th>Due Date</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasksInProgress.map((task) => (
                            <tr key={task.id}>
                                <td>{task.taskDetails}</td>
                                <td>{task.status}</td>
                                <td>{task.project}</td>
                                <td>
                                    {new Date(
                                        task.dueDate
                                    ).toLocaleDateString()}
                                </td>
                                <td>
                                    {new Date(
                                        task.createdAt.seconds * 1000
                                    ).toLocaleString()}
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(task)}>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <h3>Completed Tasks (Last 7 Days)</h3>
            {tasksCompleted.length === 0 ? (
                <p>No completed tasks in the last 7 days.</p>
            ) : (
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Status</th>
                            <th>Project</th>
                            <th>Due Date</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasksCompleted.map((task) => (
                            <tr key={task.id}>
                                <td>{task.taskDetails}</td>
                                <td>{task.status}</td>
                                <td>{task.project}</td>
                                <td>
                                    {new Date(
                                        task.dueDate
                                    ).toLocaleDateString()}
                                </td>
                                <td>
                                    {new Date(
                                        task.createdAt.seconds * 1000
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedTask && (
                <div className="edit-task-form">
                    <h3>Edit Task</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
                        <div>
                            <label>Task Details:</label>
                            <textarea
                                value={editDetails.taskDetails}
                                onChange={(e) =>
                                    setEditDetails((prev) => ({
                                        ...prev,
                                        taskDetails: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>
                        <div>
                            <label>Status:</label>
                            <select
                                value={editDetails.status}
                                onChange={(e) =>
                                    setEditDetails((prev) => ({
                                        ...prev,
                                        status: e.target.value,
                                    }))
                                }
                                required
                            >
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label>Project:</label>
                            <select
                                value={editDetails.project}
                                onChange={(e) =>
                                    setEditDetails((prev) => ({
                                        ...prev,
                                        project: e.target.value,
                                    }))
                                }
                                required
                            >
                                <option value="SNR">SNR</option>
                                <option value="Unity">Unity</option>
                                <option value="Heartbeat">Heartbeat</option>
                            </select>
                        </div>
                        <div>
                            <label>Due Date:</label>
                            <input
                                type="date"
                                value={editDetails.dueDate}
                                onChange={(e) =>
                                    setEditDetails((prev) => ({
                                        ...prev,
                                        dueDate: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="attachment">
                                Attachment (Optional):
                            </label>
                            <input
                                type="file"
                                id="attachment"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MyTasks;
