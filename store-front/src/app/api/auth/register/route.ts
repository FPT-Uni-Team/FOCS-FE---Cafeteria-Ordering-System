import authService from "@/services/authService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const res = await authService.signUp(data);
    return NextResponse.json(res.data, { status: res.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "Internal Server Error";
    return NextResponse.json({ message }, { status });
  }
}
