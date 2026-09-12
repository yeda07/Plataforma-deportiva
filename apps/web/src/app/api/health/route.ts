import { NextResponse } from "next/server";
import { webEnv } from "@/lib/env";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    app: webEnv.appName,
    environment: webEnv.appEnvironment,
    status: "ok"
  });
}
