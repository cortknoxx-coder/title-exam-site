import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "lib", "orders.json");

// In-memory fallback cache for serverless environments (like Vercel) where filesystem is read-only
let memoryOrders = null;

// Helper to read database
async function readDb() {
  if (memoryOrders !== null) {
    return memoryOrders;
  }
  
  try {
    if (!fs.existsSync(dbPath)) {
      memoryOrders = [];
      return memoryOrders;
    }
    const data = await fs.promises.readFile(dbPath, "utf8");
    memoryOrders = JSON.parse(data || "[]");
    return memoryOrders;
  } catch (error) {
    console.error("Error reading db from disk, using memory:", error);
    memoryOrders = memoryOrders || [];
    return memoryOrders;
  }
}

// Helper to write database
async function writeDb(data) {
  memoryOrders = data;
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    // Log the write warning but do not crash - this allows Vercel serverless functions to work in-memory!
    console.warn("Disk write failed (expected on Vercel serverless), falling back to dynamic in-memory state:", error);
    return true;
  }
}

export async function GET() {
  const orders = await readDb();
  return NextResponse.json(orders);
}

export async function POST(request) {
  try {
    const newOrder = await request.json();
    const orders = await readDb();
    
    // Check if it's an array (for batch/multi POST support) or a single order
    if (Array.isArray(newOrder)) {
      orders.unshift(...newOrder);
      await writeDb(orders);
      return NextResponse.json(newOrder, { status: 201 });
    } else {
      orders.unshift(newOrder);
      await writeDb(orders);
      return NextResponse.json(newOrder, { status: 201 });
    }
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedOrder = await request.json();
    const orders = await readDb();
    const index = orders.findIndex(o => o.id === updatedOrder.id || o.ticketId === updatedOrder.ticketId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updatedOrder };
      await writeDb(orders);
      return NextResponse.json(orders[index]);
    }
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("PUT /api/orders error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE() {
  await writeDb([]);
  return NextResponse.json({ success: true });
}
