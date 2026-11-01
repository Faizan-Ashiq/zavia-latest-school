import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function requireRole(roles: string[]) {
  const sb = createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await sb
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const userRole = (profile?.role || user.user_metadata?.role || "").toString().toLowerCase();
  const normalizedRoles = roles.map((r) => r.toLowerCase());

  if (!userRole || !normalizedRoles.includes(userRole)) {
    redirect("/login");
  }

  const finalProfile = {
    id: user.id,
    email: user.email || "",
    full_name: profile?.full_name || user.user_metadata?.full_name || user.email || "User",
    role: userRole as any,
    class_name: profile?.class_name || user.user_metadata?.class_name || null,
    roll_number: profile?.roll_number || user.user_metadata?.roll_number || null,
    created_at: profile?.created_at || user.created_at,
  };

  return { sb, profile: finalProfile, user };
}

