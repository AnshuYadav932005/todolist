"use client";
import React, { useState, useEffect, useMemo } from "react";
import styles from "../page.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus, FaFilter, FaEdit, FaTrash } from "react-icons/fa";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskData, setTaskData] = useState({
    taskname: "",
    description: "",
    category: "",
    priority: "Medium",
    due: "",
  });
  const [filters, setFilters] = useState({
    status: "All",
    priority: "All",
    category: "All",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/users/gettasks");
      setTasks(res.data.tasks || []);
      console.log(tasks);
    } catch (error) {
      toast.error("Failed to fetch tasks.");
      console.error("Fetch tasks error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/userInfo");
        setUser(res.data.user);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.taskname) {
      toast.error("Task title is required.");
      return;
    }

    try {
      if (editingTask) {
        const res = await axios.put("/api/users/updatetask", {
          _id: editingTask._id,
          ...taskData,
        });
        if (res.data.success) {
          toast.success("Task updated successfully!");
          fetchTasks();
        }
      } else {
        const res = await axios.post("/api/users/addtask", taskData);
        if (res.data.success) {
          toast.success("Task added successfully!");
          fetchTasks();
        }
      }
      closeModal();
    } catch (error) {
      toast.error("Failed to save task.");
      console.error("Submit task error:", error);
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskData({
        _id: task._id,
        taskname: task.taskname,
        description: task.description,
        category: task.category,
        priority: task.priority,
        due: task.due ? new Date(task.due).toISOString().split("T")[0] : "",
      });
    } else {
      setEditingTask(null);
      setTaskData({
        taskname: "",
        description: "",
        category: "",
        priority: "Medium",
        due: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const deleteTask = async (id) => {
    try {
      const res = await axios.post("/api/users/deletetask", { _id: id });
      if (res.data.success) {
        toast.success("Task deleted successfully!");
        fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to delete task.");
      console.error("Delete task error:", error);
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    try {
      const res = await axios.put("/api/users/updatetask", {
        _id: id,
        completed: !task.completed,
      });
      if (res.data.success) {
        toast.success(
          `Task marked as ${!task.completed ? "complete" : "pending"}.`
        );
        fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to update task status.");
      console.error("Toggle complete error:", error);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusMatch =
        filters.status === "All" ||
        (filters.status === "Completed" && task.completed) ||
        (filters.status === "Pending" && !task.completed);
      const priorityMatch =
        filters.priority === "All" || task.priority === filters.priority;
      const categoryMatch =
        filters.category === "All" || task.category === filters.category;
      return statusMatch && priorityMatch && categoryMatch;
    });
  }, [tasks, filters]);

  const categories = useMemo(
    () => ["All", ...new Set(tasks.map((t) => t.category).filter(Boolean))],
    [tasks]
  );

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.dashboardContainer}>

        <aside className={styles.sidebar}>
          <section className={styles.filterPart}>
            <h2>
              <FaFilter /> Filters
            </h2>
            <div className={styles.filterFeature}>
              <div className={styles.filterGroup}>
                <label>Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="All">All</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Priority</label>
                <select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                >
                  <option value="All">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        </aside>

        <main className={styles.homeMain}>
          <header className={styles.homeHeader}>
            <h1>Welcome Back, {user?user.toUpperCase() : "User"}</h1>
            <button className={styles.addButton} onClick={() => openModal()}>
              <FaPlus /> Add Task
            </button>
          </header>

          <section className={styles.taskList}>
            {isLoading ? (
              <p className={styles.noTasks}>Loading tasks...</p>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className={`${styles.taskCard} ${
                    task.completed ? styles.completed : ""
                  }`}
                >
                  <div className={styles.taskHeader}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task._id)}
                      className={styles.taskCheckbox}
                    />
                    <h3 className={styles.taskTitle}>{task.taskname}</h3>
                    <div className={styles.taskActions}>
                      <button onClick={() => openModal(task)} title="Edit Task">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        title="Delete Task"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <p className={styles.taskDescription}>{task.description}</p>
                  <div className={styles.taskMeta}>
                    <span
                      className={`${styles.badge} ${
                        styles[`priority${task.priority}`]
                      }`}
                    >
                      {task.priority}
                    </span>
                    {task.category && (
                      <span className={styles.badge}>{task.category}</span>
                    )}
                    {task.due && (
                      <span className={styles.badge}>
                        {new Date(task.due).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noTasks}>
                No tasks found.
              </p>
            )}
          </section>
        </main>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  name="taskname"
                  value={taskData.taskname}
                  onChange={handleInputChange}
                  placeholder="Task title"
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={taskData.description}
                  onChange={handleInputChange}
                  placeholder="More about the task"
                  className={styles.formInput}
                  rows="3"
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={taskData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Work, Personal"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Due Date</label>
                <input
                  type="date"
                  name="due"
                  value={taskData.due}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Priority</label>
                <select
                  name="priority"
                  value={taskData.priority}
                  onChange={handleInputChange}
                  className={styles.formInput}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  {editingTask ? "Save Changes" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
