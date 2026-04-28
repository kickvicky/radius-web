"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, ImageIcon, Camera, Send, X, Loader2, CheckCircle } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { FEED_POSTS_QUERY_KEY } from "@/hooks/useFeedPosts";
import { uploadImage } from "@/lib/cloudinary";
import { createPost } from "@/lib/api/posts";
import { FeedTag } from "@/types/feed";
import { useUser } from "@/providers/UserProvider";

// ─── Types ────────────────────────────────────────────────────────────────────
type SubmitState = "idle" | "uploading" | "posting" | "done";

const TAGS: { value: FeedTag; label: string; emoji: string }[] = [
  { value: "LOCAL",         label: "Local",         emoji: "📍" },
  { value: "HAPPENING NOW", label: "Happening Now",  emoji: "⚡" },
  { value: "ALERT",         label: "Alert",          emoji: "🚨" },
  { value: "TRENDING",      label: "Trending",       emoji: "🔥" },
  { value: "CAUTION",       label: "Caution",        emoji: "⚠️" },
];

// ─── Tag chip selector ────────────────────────────────────────────────────────
function TagSelector({
  selected,
  onChange,
  disabled,
}: {
  selected: FeedTag | null;
  onChange: (tag: FeedTag | null) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {TAGS.map(({ value, label, emoji }) => {
        const isActive = selected === value;
        return (
          <button
            key={value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(isActive ? null : value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
              isActive
                ? "bg-primary text-surface"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            <span>{emoji}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Sub-components (module scope — never redefined between renders) ──────────
function LocationStatus({
  loading,
  error,
  hasCoords,
}: {
  loading: boolean;
  error: string | null;
  hasCoords: boolean;
}) {
  if (loading) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
        <Loader2 className="w-3 h-3 animate-spin" />
        Detecting location…
      </span>
    );
  }
  if (error || !hasCoords) {
    return (
      <span className="text-xs text-error">
        Location unavailable — enable location access to post
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-primary">
      <MapPin className="w-3 h-3" />
      Location detected
    </span>
  );
}

function SubmitLabel({ state }: { state: SubmitState }) {
  if (state === "uploading") {
    return <><Loader2 className="w-4 h-4 animate-spin" /> Uploading photo…</>;
  }
  if (state === "posting") {
    return <><Loader2 className="w-4 h-4 animate-spin" /> Posting…</>;
  }
  if (state === "done") {
    return <><CheckCircle className="w-4 h-4" /> Posted!</>;
  }
  return <><Send className="w-4 h-4" /> Post to Pulse</>;
}

// Reads the user from the server-rendered promise via <UserProvider>. Wrapped
// in its own component so we can Suspend just this chip instead of the whole
// form while the /api/auth/status fetch resolves.
function PostingAsBadge() {
  const user = useUser();
  if (!user) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={user.avatarDataUrl}
        alt={`Avatar for @${user.username}`}
        width={28}
        height={28}
        className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-primary/20 to-primary/5 shrink-0"
      />
      <span className="truncate">
        Posting as <span className="font-medium text-on-surface">@{user.username}</span>
      </span>
    </div>
  );
}

function PostingAsBadgeFallback() {
  return (
    <div className="flex items-center gap-2 text-xs text-on-surface-variant/60">
      <div className="w-7 h-7 rounded-[8px] bg-surface-container-high animate-pulse" />
      <span>Loading identity…</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CreatePostForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { lat, lng, loading: locationLoading, error: locationError } = useGeolocation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<FeedTag | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const hasCoords = lat !== null && lng !== null;
  const isBusy = submitState !== "idle";
  const canSubmit = content.trim().length > 0 && hasCoords && !isBusy;

  // ── Photo selection ──────────────────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    if (!selected) return;

    // Revoke previous object URL to avoid memory leaks
    if (preview) URL.revokeObjectURL(preview);

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function removePhoto() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);

    // Stable per-submission key. If a network retry fires for this same
    // submit (lost response, double-click race, etc.) the Gateway will see
    // the same key and dedupe — no duplicate post. A fresh key is minted
    // for each new submission attempt.
    const idempotencyKey = crypto.randomUUID();

    try {
      let imageUrl: string | undefined;

      if (file) {
        setSubmitState("uploading");
        imageUrl = await uploadImage(file);
      }

      setSubmitState("posting");
      await createPost(
        {
          content: content.trim(),
          imageUrl,
          tag: tag ?? "LOCAL",
          latitude: lat!,
          longitude: lng!,
        },
        { idempotencyKey }
      );

      // Bust the feed cache so the pulse page fetches fresh data on arrival
      await queryClient.invalidateQueries({ queryKey: FEED_POSTS_QUERY_KEY });

      // Brief success state so the user sees confirmation before leaving
      setSubmitState("done");
      await new Promise((r) => setTimeout(r, 1500));
      router.push("/pulse");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitState("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ── Identity chip ── */}
      <Suspense fallback={<PostingAsBadgeFallback />}>
        <PostingAsBadge />
      </Suspense>

      {/* ── Text area ── */}
      <div className="bg-surface-container rounded-[12px] p-4">
        <textarea
          placeholder="What's happening nearby?"
          className="w-full bg-transparent text-sm resize-none outline-none min-h-[120px] placeholder:text-on-surface-variant/50"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isBusy}
          maxLength={500}
        />
        <p className="text-right text-xs text-on-surface-variant/50">
          {content.length}/500
        </p>
      </div>

      {/* ── Tag selector ── */}
      <div className="bg-surface-container rounded-[12px] p-4 space-y-2">
        <p className="text-xs font-medium text-on-surface-variant">Tag your post</p>
        <TagSelector selected={tag} onChange={setTag} disabled={isBusy} />
      </div>

      {/* ── Photo preview ── */}
      {preview && (
        <div className="relative rounded-[12px] overflow-hidden">
          <Image
            src={preview}
            alt="Selected photo"
            width={600}
            height={400}
            className="w-full object-cover max-h-60 rounded-[12px]"
            unoptimized // object URL — can't go through Next.js image optimisation
          />
          <button
            type="button"
            onClick={removePhoto}
            disabled={isBusy}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
            aria-label="Remove photo"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* ── Action row ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Location pill */}
          <div className="px-3 py-2 rounded-[10px] bg-surface-container">
            <LocationStatus
              loading={locationLoading}
              error={locationError}
              hasCoords={hasCoords}
            />
          </div>

          {/* Gallery picker */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-surface-container text-on-surface-variant text-sm hover:bg-surface-container-highest transition-colors disabled:opacity-50"
          >
            <ImageIcon className="w-4 h-4" />
            {file ? "Change" : "Gallery"}
          </button>

          {/* Camera — capture="environment" opens the rear camera on mobile */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isBusy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-surface-container text-on-surface-variant text-sm hover:bg-surface-container-highest transition-colors disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            Camera
          </button>

          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <p className="text-xs text-error bg-error/10 rounded-[8px] px-3 py-2">
          {error}
        </p>
      )}

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-[12px] font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          submitState === "done"
            ? "bg-green-500 text-white"
            : "bg-gradient-to-r from-primary to-primary/80 text-surface"
        }`}
      >
        <SubmitLabel state={submitState} />
      </button>
    </form>
  );
}
