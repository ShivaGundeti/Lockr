import { NextResponse } from "next/server";
import { Vault } from "../../../../../lib/model/user";
import { ConnectDB } from "../../../../../lib/config/db";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY!;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vaultid = searchParams.get("vaultid");

    if (!vaultid) {
      return NextResponse.json({ message: "vaultid is required" }, { status: 400 });
    }

    await ConnectDB();

    const vault = await Vault.findById(vaultid);

    if (!vault) {
      return NextResponse.json({ success: false, message: "No vault found!" }, { status: 404 });
    }

   
    let decryptedVault = { ...vault._doc };
    if (vault.password) {
      try {
        const bytes = CryptoJS.AES.decrypt(vault.password, SECRET_KEY);
        decryptedVault.password = bytes.toString(CryptoJS.enc.Utf8);
      } catch {}
    }

    return NextResponse.json({ success: true, vault: decryptedVault }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vaultid = searchParams.get("vaultid");

    if (!vaultid) {
      return NextResponse.json({ message: "vaultid is required" }, { status: 400 });
    }

    const body = await req.json();
    const { data: encryptedData } = body; // frontend sends { data: encryptedData }

    if (!encryptedData) {
      return NextResponse.json({ message: "Encrypted data is required" }, { status: 400 });
    }

    // Decrypt data
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { title, username, password, url, notes } = decryptedData;

    await ConnectDB();

    const updatedVault = await Vault.findByIdAndUpdate(
      vaultid,
      { title, username, password, url, notes },
      { new: true }
    );

    if (!updatedVault) {
      return NextResponse.json({ success: false, message: "Vault not found!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, vault: updatedVault }, { status: 200 });
  } catch (error) {
    
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vaultid = searchParams.get("vaultid");

    if (!vaultid) {
      return NextResponse.json({ message: "vaultid is required" }, { status: 400 });
    }

    await ConnectDB();

    const deletedVault = await Vault.findByIdAndDelete(vaultid);

    if (!deletedVault) {
      return NextResponse.json({ success: false, message: "Vault not found!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Vault deleted successfully" }, { status: 200 });
  } catch (error) {
   
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
