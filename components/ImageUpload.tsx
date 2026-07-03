"use client";

import { ImagePlus } from "lucide-react";

type ImageUploadProps = {
  label?: string;
  previewUrl?: string | null;
  onFileChange?: (file: File | null) => void;
};

export function ImageUpload({ label = "Upload Item Photo", previewUrl, onFileChange }: ImageUploadProps) {
  return (
    <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white p-5 text-center text-slate-600">
      {previewUrl ? (
        <img src={previewUrl} alt="" className="mb-3 h-32 w-full rounded-md object-cover" />
      ) : (
        <ImagePlus className="mb-2 h-8 w-8 text-palm" aria-hidden="true" />
      )}
      <span className="text-sm font-semibold">{label}</span>
      <span className="mt-1 text-xs text-slate-500">Choose a clear product photo</span>
      <input
        className="sr-only"
        type="file"
        accept="image/*"
        onChange={(event) => onFileChange?.(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}
