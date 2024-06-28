import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { connect } from "@/config/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

type User = {
  id: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
};

export async function GET(request: NextRequest) {
  if (request.method !== "GET") {
    return NextResponse.json(
      {
        message: "Method not allowed",
      },
      { status: 405 }
    ); 
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        message: "No token provided",
      },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User;
    const user = await User.findById(decoded.id).select("-password"); 

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user,
        message: "Method not allowed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
}