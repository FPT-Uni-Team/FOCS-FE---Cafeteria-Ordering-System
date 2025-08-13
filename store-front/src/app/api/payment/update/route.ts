import cartService from "@/services/cartService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderCode, statusString } = await req.json();
    const res = await cartService.order_update({ orderCode, statusString });
    return NextResponse.json(res.data, { status: res.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "Internal Server Error";
    return NextResponse.json({ message }, { status });
  }
}
