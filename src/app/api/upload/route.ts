import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const patientAddress = formData.get("patientAddress") as string;
    const category = formData.get("category") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const jwt = process.env.PINATA_JWT;
    if (!jwt) {
      return NextResponse.json({ error: "Pinata JWT not configured" }, { status: 500 });
    }

    const pinataFormData = new FormData();
    pinataFormData.append("file", file);
    
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        patientAddress: patientAddress || "unknown",
        category: category || "other",
        uploadTimestamp: Date.now().toString(),
      },
    });
    pinataFormData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    pinataFormData.append("pinataOptions", options);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: pinataFormData,
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error: `Pinata upload failed: ${error}` }, { status: 500 });
    }

    const data = await res.json();
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";

    return NextResponse.json({
      success: true,
      ipfsHash: data.IpfsHash,
      pinataUrl: `https://${gateway}/ipfs/${data.IpfsHash}`,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Use POST to upload files" });
}
