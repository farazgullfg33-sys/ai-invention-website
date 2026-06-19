import { handleHermesMcpGet, handleHermesMcpPost } from "@/lib/hermes-mcp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleHermesMcpGet(request);
}

export async function POST(request: Request) {
  return handleHermesMcpPost(request);
}
