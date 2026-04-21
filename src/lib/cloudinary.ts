// ─── Cloudinary unsigned upload ───────────────────────────────────────────────
// Uses an *unsigned* upload preset so no server-side signing is needed.
// Configure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
// NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local.

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  // Warn at module load time so misconfiguration is obvious in the console.
  console.warn(
    "[cloudinary] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or " +
    "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set."
  );
}

/**
 * Uploads a File to Cloudinary and returns the `secure_url` of the
 * uploaded asset. Throws on network errors or non-2xx responses.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary is not configured. Check your .env.local.");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Cloudinary upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.secure_url as string;
}
