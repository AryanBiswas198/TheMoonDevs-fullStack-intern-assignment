import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { connect } from "@/config/dbConfig";

connect();

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({
        error: "Username and password are required fields",
      }, {status: 404});
    }

    const user = await User.findOne({ username });
    if (!user) {
        return NextResponse.json({
            error: "User does not exist",
        },{ status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(passwordMatch){
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
        };
    
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: "1h", 
        });
    
        user.token = token;
        await user.save();
    
        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true, 
        };
    
        const response = NextResponse.json({
            success: true,
            message: "User logged in successfully",
            username: user.username,
            authToken: token,
        }, {status: 200});
        
        response.cookies.set("authToken", token, cookieOptions);
    
        return response;
    }
    else{
        return NextResponse.json({
            error: "Password doesn't match",
        }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || "An error occurred during login",
    }, {status: 500});
  }
}
