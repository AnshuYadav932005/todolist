import { connectdb } from "@/dbconfig/dbconfig";
import jwt from "jsonwebtoken";
import Task from "@/models/taskman";
import { NextResponse } from "next/server";

connectdb();

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }
    const decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
    const userEmail = decodedToken.email;

    const reqBody = await request.json();
    const { taskname, description, priority, category, due } = reqBody;

    if (!taskname) {
      return NextResponse.json(
        { error: "Task name is required" },
        { status: 400 }
      );
    }
    if (due) {
      const today = new Date();
      if (new Date(due) < today) {
        return NextResponse.json(
          { error: "Due date cannot be in the past" },
          { status: 400 }
        );
      }
    }

    let userTasks = await Task.findOne({ email: userEmail });

    if (!userTasks) {
      userTasks = new Task({
        email: userEmail,
        tasks: [],
      });
    } else {
      console.log("No tasks found");
    }
    const newTask = {
      taskname,
      description: description || "",
      priority: priority || "Medium",
      category: category || "General",
      due: due || null,
      completed: false,
    };
    userTasks.tasks.push(newTask);
    const saveUserTasks = await userTasks.save();
    const addedTask = saveUserTasks.tasks[saveUserTasks.tasks.length - 1];

    return NextResponse.json({
      message: "Task added successfully",
      success: true,
      task: addedTask,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An internal server error occurred.", details: error.message },
      { status: 500 }
    );
  }
}
