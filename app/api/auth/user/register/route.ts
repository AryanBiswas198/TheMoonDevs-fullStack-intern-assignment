import { connect } from "@/config/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

connect();

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({
        error: "Username, email, and password are required fields",
      }, {status: 404});
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({
        success: false,
        error: "Email already exists",
      }, {status: 402});
    }

    const existingUser = await User.findOne({username});
    if(existingUser){
      return NextResponse.json({
        error: "UserName Already Exists",
      }, {status: 401});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: savedUser,
    }, {status: 200});
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "An error occurred while creating the user",
    }, {status: 500});
  }
}
