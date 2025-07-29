import cartService from "@/services/cartService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { menu_item_id, variants, quantity, note, actorId, tableId } =
      await req.json();
    const cartItem = {
      menu_item_id,
      variants,
      quantity,
      note,
    };

    const dataTable = {
      actorId,
      tableId,
    };
    const res = await cartService.add(cartItem, dataTable);
    return NextResponse.json(res.data, { status: res.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "Internal Server Error";
    return NextResponse.json({ message }, { status });
  }
}
