import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("landing_page_content")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching landing content:", error);
      // Return 404 or specific error if table doesn't exist yet, but for now 500 is safe
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
