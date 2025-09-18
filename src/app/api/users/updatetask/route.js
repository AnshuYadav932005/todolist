import { NextResponse } from "next/server";
import { connectdb } from "@/dbconfig/dbconfig";
import Task from "@/models/taskman";
import jwt from "jsonwebtoken";

connectdb();

export async function PUT(request) {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      return null;
    }
    const decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
    if (!decodedToken) {
      console.log("Token not found.");
    }
    const userEmail = decodedToken.email;
    if (!userEmail) {
      return NextResponse.json(
        { message: "Authentication failed" },
        { status: 401 }
      );
    }

    const reqBody = await request.json();
    const { _id, ...updateData } = reqBody;

    if (!_id) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
    }
    if (updateData.due) {
      const today = new Date();
      if (new Date(updateData.due) < today) {
        return NextResponse.json(
          { error: "Due date cannot be in the past" },
          { status: 400 }
        );
      }
    }

    const userTasks = await Task.findOne({ email: userEmail });
    if (!userTasks) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const taskIndex = userTasks.tasks.findIndex(
      (task) => task._id.toString() === _id
    );
    if (taskIndex === -1) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const updatedTask = {
      ...userTasks.tasks[taskIndex].toObject(),
      ...updateData,
    };
    userTasks.tasks[taskIndex] = updatedTask;

    await userTasks.save();

    return NextResponse.json({
      message: "Task updated successfully",
      success: true,
      task: userTasks.tasks[taskIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating task", error: error.message },
      { status: 500 }
    );
  }
}
