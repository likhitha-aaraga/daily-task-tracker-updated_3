import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useParams, Link } from "react-router-dom";

const EmployeeDetails = () => {
    const [employee, setEmployee] = useState(null);
    const [tasks, setTasks] = useState([]); // State for storing task details
    const [loading, setLoading] = useState(true);
    const { id, emplid } = useParams(); // Retrieve employee and task-specific IDs from URL params

    const fetchDetails = async () => {
        setLoading(true);
        try {
            // Fetch employee details
            const employeePromise = getDoc(doc(db, "Employee-details", id));

            // Fetch task details for the given employee
            const tasksPromise = getDocs(
                query(
                    collection(db, "Task_details"),
                    where("employee_id", "==", emplid),
                    orderBy("createdAt", "desc")
                )
            );

            const [employeeSnap, taskSnap] = await Promise.all([
                employeePromise,
                tasksPromise,
            ]);

            if (employeeSnap.exists()) {
                setEmployee(employeeSnap.data());
            } else {
                alert("Employee not found.");
            }

            if (!taskSnap.empty) {
                const taskList = taskSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTasks(taskList);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error("Error fetching details:", error);
            alert("Failed to fetch details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        fetchDetails(); // Fetch employee and task data when the component mounts
    }, [id, emplid]);

    if (loading) {
        return <p>Loading employee details...</p>;
    }

    if (!employee) {
        return <p>No employee data found</p>;
    }

    return (
        <div>
            <div className="employee-details">
                <h2>Employee Details</h2>
                <div className="employee-info">
                    <p><strong>Employee Name:</strong> {employee.name}</p>
                    <p><strong>Employee ID:</strong> {employee.Employee_id}</p>
                    <p><strong>Role:</strong> {employee.Role}</p>
                    <p ><strong>Status:</strong> {employee.status}</p>
                    <p><strong>Phone Number:</strong> {employee.Phone_Number}</p>
                    <p><strong>Email ID:</strong> {employee.Email_id}</p>
                </div>
                <h3>Task Information</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Due Date</th>
                            <th>Project</th>
                            <th>Task Description</th>
                            <th>Task Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>
                                        <Link
                                            to={`/employee/${id}/tasks/${task.id}`}
                                            title={`View task details for ${task.id}`}
                                            className="task-date-link"
                                        >
                                            {formatDate(task.dueDate)}
                                        </Link>
                                    </td>
                                    <td>{task.project}</td>
                                    <td>{task.taskDetails || task.task_description}</td>
                                    <td>{task.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No tasks assigned</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div>
                    <Link to="/managerhomepage">
                        <button>Back</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;

