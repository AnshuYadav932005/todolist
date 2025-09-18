import { NextResponse } from "next/server";
import { connectdb } from "@/dbconfig/dbconfig";
import Task from "@/models/taskman";
import jwt from "jsonwebtoken";

connectdb();

export async function POST(request) {
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
    const { _id } = reqBody;

    if (!_id) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
    }

    const result = await Task.updateOne(
      { email: userEmail },
      { $pull: { tasks: { _id: _id } } }
    );

    return NextResponse.json({
      message: "Task deleted successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting task", error: error.message },
      { status: 500 }
    );
  }
}
