import { NextResponse } from "next/server";
import { connectdb } from "@/dbconfig/dbconfig";
import Task from "@/models/taskman";
import jwt from "jsonwebtoken";

connectdb();

export async function GET(request) {
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
        { message: "Authentication failed: No user email" },
        { status: 401 }
      );
    }

    const userTasks = await Task.findOne({ email: userEmail });

    if (!userTasks) {
      return NextResponse.json({
        message: "No tasks found for user",
        success: true,
        tasks: [],
      });
    }

    return NextResponse.json({
      message: "Tasks fetched successfully",
      success: true,
      tasks: userTasks.tasks,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching tasks", error: error.message },
      { status: 500 }
    );
  }
}
