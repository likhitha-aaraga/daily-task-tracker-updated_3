import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const TaskDetails = () => {
  const { employeeId, taskDate } = useParams(); // Retrieve employeeId and taskDate from URL params
  const [taskDetails, setTaskDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setLoading(true);
      try {
        const taskDocRef = doc(db, "Task_details", taskDate); // Use `taskDate` as the document ID
        const taskSnap = await getDoc(taskDocRef);

        if (taskSnap.exists()) {
          setTaskDetails({ id: taskSnap.id, ...taskSnap.data() });
        } else {
          alert("Task not found.");
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
        alert("Failed to fetch task details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskDate]);

  if (loading) {
    return <p>Loading task details...</p>;
  }

  if (!taskDetails) {
    return <p>No task details found for this ID.</p>;
  }

  return (
    <div>
      <h3>Task Details</h3>
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Task Description</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{taskDetails.project}</td>
            <td>{taskDetails.taskDetails}</td>
            <td>{taskDetails.status}</td>
            <td>{formatDate(taskDetails.createdAt)}</td>
            <td>{taskDetails.dueDate}</td>
          </tr>
        </tbody>
      </table>

      {/* Back button */}
      <div className="back-button-container">
        <Link to={`/employee-details/${employeeId}/employeeId/${taskDetails.employee_id}`}>
          <button className="back-button">Back</button>
        </Link>
      </div>
    </div>
  );
};

export default TaskDetails;
