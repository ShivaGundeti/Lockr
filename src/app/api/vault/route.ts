import { NextResponse } from "next/server";
import { Vault } from "../../../../lib/model/user";
import { ConnectDB } from "../../../../lib/config/db";

import CryptoJS from "crypto-js";

export async function GET(req: Request) {
try {
      const { searchParams } = new URL(req.url);
    
      const userid = searchParams.get("userid");
    
      if (!userid) {
        return NextResponse.json({ Message: "Required user id for vaults" });
      }
      await ConnectDB();
      const getvaults = await Vault.find({ownerid:userid});
      if (!getvaults) {
        return NextResponse.json({
          Failed: true,
          Message: "No Secrets are found!! Add One",
        });
      }
      return NextResponse.json({ Vaults: getvaults });
} catch (error) {
    return NextResponse.json({error})
}
}

export async function POST(req: Request) {
   try {
    // Parse request body
    const { data } = await req.json();
    if (!data) {
      return NextResponse.json({ message: "No data received" }, { status: 400 });
    }

    // Connect to MongoDB
    await ConnectDB();
   

    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(data, process.env.CRYPTO_SECRET_KEY!);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const { title, username, password, url, notes, ownerid } = decrypted;

    // Create Vault document
    const vaultDoc = await Vault.create({ title, username, password, url, notes, ownerid });
  

    return NextResponse.json({ success: true, message: "Vault added successfully" });
  } catch (error) {
    
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : error });
  }
}

