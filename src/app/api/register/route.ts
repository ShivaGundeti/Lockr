import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/config/db";
import {User} from "../../../../lib/model/user";
import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    if (!data) {
      return NextResponse.json({ Message: "No data received" }, { status: 400 });
    }

    

    const bytes = CryptoJS.AES.decrypt(data, process.env.CRYPTO_SECRET_KEY!);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { name, email, password } = decrypted;

    if (!name || !email || !password) {
      return NextResponse.json({ Message: "Please fill all fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ Message: "User already exists" }, { status: 409 });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashPassword,
    });

    return NextResponse.json({ Message: "Registered successfully" }, { status: 201 });
  } catch (error) {
   
    return NextResponse.json({ error: error|| "Internal Server Error" }, { status: 500 });
  }
}
