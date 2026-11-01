"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

async function upload(sb: ReturnType<typeof createClient>, file: FormDataEntryValue | null, folder: string) {
  if (!(file instanceof File) || !file.size) return null;
  const admin = createAdmin();
  const bucketName = "school-assets";

  try {
    // Attempt to list or create bucket if needed
    const { data: buckets } = await admin.storage.listBuckets();
    const hasSchoolBucket = buckets?.some((b) => b.name === bucketName);
    const hasFilesBucket = buckets?.some((b) => b.name === "files");

    const targetBucket = hasSchoolBucket ? bucketName : hasFilesBucket ? "files" : bucketName;
    if (!hasSchoolBucket && !hasFilesBucket) {
      await admin.storage.createBucket(bucketName, { public: true });
    }

    const path = `${folder}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await admin.storage.from(targetBucket).upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
    });

    if (error) {
      // Fallback try with user client
      const { error: sbErr } = await sb.storage.from("files").upload(path, file);
      if (sbErr) throw new Error(error.message);
      return sb.storage.from("files").getPublicUrl(path).data.publicUrl;
    }

    return admin.storage.from(targetBucket).getPublicUrl(path).data.publicUrl;
  } catch (err: any) {
    const path = `${folder}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await sb.storage.from("files").upload(path, file);
    if (error) throw new Error(error.message || "File upload failed");
    return sb.storage.from("files").getPublicUrl(path).data.publicUrl;
  }
}

// ---- Auth ----
export async function logoutAction() {
  await createClient().auth.signOut();
  redirect("/");
}
export const signOut = logoutAction;

// ---- Principal: Announcements ----
export async function createAnnouncementAction(f: FormData) {
  const { sb, profile } = await requireRole(["principal"]);
  const title = s(f, "title");
  const content = s(f, "content");
  const target_audience = (s(f, "target_audience") || "all") as "all" | "students" | "teachers";
  const pinned = f.get("pinned") === "on" || f.get("pinned") === "true";

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  const { error } = await sb.from("announcements").insert({
    title,
    content,
    target_audience,
    pinned,
    created_by: profile.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/principal");
  revalidatePath("/student");
  revalidatePath("/teacher");
}
export const postAnnouncement = createAnnouncementAction;

export async function togglePinAnnouncementAction(f: FormData) {
  return togglePin(f);
}

export async function togglePin(f: FormData) {
  const { sb } = await requireRole(["principal"]);
  const id = s(f, "id");
  const pinned = s(f, "pinned") !== "true";
  
  await sb.from("announcements").update({ pinned }).eq("id", id);
  
  revalidatePath("/", "layout");
  revalidatePath("/principal");
  revalidatePath("/student");
  revalidatePath("/teacher");
}

export async function deleteAnnouncementAction(f: FormData) {
  const { sb } = await requireRole(["principal"]);
  const id = s(f, "id");
  if (!id) return;

  const { error } = await sb.from("announcements").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/principal");
  revalidatePath("/student");
  revalidatePath("/teacher");
}
export const deleteAnnouncement = deleteAnnouncementAction;

// ---- Past Papers Upload & Delete (Principal & Teacher) ----
export async function uploadPastPaperAction(f: FormData) {
  const { sb, profile } = await requireRole(["principal", "teacher"]);
  const title = s(f, "title");
  const class_name = s(f, "class_name");
  const file = f.get("file");

  if (!title || !class_name) {
    throw new Error("Exam Title and Target Class are required.");
  }

  const url = await upload(sb, file, "papers");
  if (!url) throw new Error("Please choose a valid file to upload.");

  const { error } = await sb.from("past_papers").insert({
    title,
    class_name,
    file_url: url,
    uploaded_by_role: profile.role,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/principal");
  revalidatePath("/student");
  revalidatePath("/teacher");
}
export const uploadPaper = uploadPastPaperAction;
export const uploadPaperAction = uploadPastPaperAction;

export async function deletePaperAction(f: FormData) {
  const { sb } = await requireRole(["principal", "teacher"]);
  const id = s(f, "id");
  const url = s(f, "url");

  if (url) {
    const isSchoolAssets = url.includes("/school-assets/");
    const isFiles = url.includes("/files/");
    const path = isSchoolAssets ? url.split("/school-assets/")[1] : isFiles ? url.split("/files/")[1] : null;
    const bucket = isSchoolAssets ? "school-assets" : "files";
    if (path) {
      try {
        await createAdmin().storage.from(bucket).remove([decodeURIComponent(path)]);
      } catch {}
    }
  }

  await createAdmin().from("past_papers").delete().eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/principal");
  revalidatePath("/student");
  revalidatePath("/teacher");
}
export const deletePaper = deletePaperAction;

// ---- Homework / Diary (Principal & Teacher) ----
export async function createHomeworkAction(f: FormData) {
  const { sb, profile } = await requireRole(["principal", "teacher"]);
  const class_name = s(f, "class_name");
  const subject = s(f, "subject");
  const date = s(f, "date") || new Date().toISOString().slice(0, 10);
  const description = s(f, "description");
  const file = f.get("file");

  if (!class_name || !subject || !description) {
    throw new Error("Class, Subject, and Description are required.");
  }

  const attachment_url = await upload(sb, file, "diary");

  const { error } = await sb.from("diary_homework").insert({
    class_name,
    subject,
    date,
    description,
    attachment_url,
    created_by: profile.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/principal");
  revalidatePath("/student");
  revalidatePath("/teacher");
}
export const addDiary = createHomeworkAction;

export async function deleteHomeworkAction(f: FormData) {
  const { sb, profile } = await requireRole(["principal", "teacher"]);
  const id = s(f, "id");
  const attachment_url = s(f, "url");

  if (!id) return;

  const admin = createAdmin();

  // If caller is a teacher, verify they created this assignment
  if (profile.role === "teacher") {
    const { data: existing } = await admin
      .from("diary_homework")
      .select("id, created_by")
      .eq("id", id)
      .maybeSingle();

    if (existing && existing.created_by && existing.created_by !== profile.id) {
      throw new Error("Access Denied: Teachers are only authorized to delete their own homework assignments.");
    }
  }

  if (attachment_url) {
    const isSchoolAssets = attachment_url.includes("/school-assets/");
    const isFiles = attachment_url.includes("/files/");
    const path = isSchoolAssets
      ? attachment_url.split("/school-assets/")[1]
      : isFiles
      ? attachment_url.split("/files/")[1]
      : null;
    const bucket = isSchoolAssets ? "school-assets" : "files";
    if (path) {
      try {
        await admin.storage.from(bucket).remove([decodeURIComponent(path)]);
      } catch {}
    }
  }

  if (profile.role === "teacher") {
    await admin.from("diary_homework").delete().eq("id", id).eq("created_by", profile.id);
  } else {
    // Principal has administrative full delete access
    await admin.from("diary_homework").delete().eq("id", id);
  }

  revalidatePath("/", "layout");
  revalidatePath("/principal");
  revalidatePath("/student");
  revalidatePath("/teacher");
}

// ---- Principal: Settings ----
export async function updateSettingsAction(f: FormData) {
  const { sb } = await requireRole(["principal"]);
  const youtube_url = s(f, "youtube_url");
  const whatsapp_number = s(f, "whatsapp_number");
  const contact_email = s(f, "contact_email");

  const { data } = await sb.from("school_settings").select("id").limit(1).maybeSingle();
  if (data?.id) {
    await sb.from("school_settings").update({
      youtube_url,
      whatsapp_number,
      contact_email,
    }).eq("id", data.id);
  } else {
    await sb.from("school_settings").insert({
      youtube_url,
      whatsapp_number,
      contact_email,
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/principal");
  revalidatePath("/student");
  revalidatePath("/teacher");
}
export const saveSettingsAction = updateSettingsAction;
export const saveSettings = updateSettingsAction;

// ---- Principal: Student Management ----
export async function addStudentByPrincipalAction(f: FormData) {
  await requireRole(["principal"]);
  const email = s(f, "email");
  const password = s(f, "password");
  const full_name = s(f, "full_name");
  const roll_number = s(f, "roll_number");
  const class_name = s(f, "class_name");

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const admin = createAdmin();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name,
      roll_number,
      class_name,
    },
  });

  if (error) throw new Error(error.message);

  if (data?.user) {
    // Upsert directly into public.profiles to guarantee immediate reactivity
    const { error: pErr } = await admin.from("profiles").upsert(
      {
        id: data.user.id,
        full_name: full_name || email,
        roll_number: roll_number || null,
        class_name: class_name || null,
        email,
        role: "student",
      },
      { onConflict: "id" }
    );
    if (pErr) console.error("Profile upsert error:", pErr);
  }

  revalidatePath("/principal");
}
export const createStudent = addStudentByPrincipalAction;

export async function updateStudentAction(f: FormData) {
  const { sb } = await requireRole(["principal"]);
  const id = s(f, "id");
  const full_name = s(f, "full_name");
  const roll_number = s(f, "roll_number");
  const class_name = s(f, "class_name");

  await sb.from("profiles").update({
    full_name,
    roll_number,
    class_name,
  }).eq("id", id);

  revalidatePath("/principal");
  revalidatePath(`/principal/students/${id}`);
}
export const updateStudent = updateStudentAction;

export async function deleteStudentAction(f: FormData) {
  await requireRole(["principal"]);
  const id = s(f, "id");
  if (!id) return;

  const admin = createAdmin();
  try {
    await admin.auth.admin.deleteUser(id);
  } catch {}
  await admin.from("profiles").delete().eq("id", id);

  revalidatePath("/principal");
}
export const deleteStudent = deleteStudentAction;

export async function deleteStudentAndRedirectAction(f: FormData) {
  await deleteStudentAction(f);
  redirect("/principal");
}

// ---- Auth: Profile Sync on Registration ----
export async function registerProfileSyncAction(payload: {
  userId?: string;
  email: string;
  role: "student" | "teacher";
  full_name: string;
  roll_number?: string | null;
  class_name?: string | null;
  subject?: string | null;
}) {
  try {
    const admin = createAdmin();
    let uid = payload.userId;
    if (!uid) {
      try {
        const { data: usersData } = await admin.auth.admin.listUsers();
        const found = usersData?.users?.find(
          (u) => u.email?.toLowerCase() === payload.email.toLowerCase()
        );
        uid = found?.id;
      } catch {}
    }
    if (!uid) return { success: false };

    const isTeacher = payload.role === "teacher";
    
    // Attempt inserting with all available fields first
    try {
      const { error: fullErr } = await admin.from("profiles").upsert({
        id: uid,
        full_name: payload.full_name,
        email: payload.email,
        role: payload.role,
        roll_number: isTeacher ? null : (payload.roll_number || null),
        class_name: isTeacher ? (payload.subject || null) : (payload.class_name || null),
      });
      if (!fullErr) return { success: true };
    } catch {}

    // Fallback inserting basic fields if extended columns don't exist
    const { error: basicErr } = await admin.from("profiles").upsert({
      id: uid,
      full_name: payload.full_name,
      email: payload.email,
      role: payload.role,
    });

    return { success: !basicErr };
  } catch (err: any) {
    console.warn("registerProfileSyncAction non-fatal error:", err?.message || err);
    return { success: false, error: err?.message || "Profile sync error" };
  }
}

