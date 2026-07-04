"use client";

import { ImagePlus } from "lucide-react";

type ImageUploadProps = {
  label?: string;
  previewUrl?: string | null;
  onFileChange?: (file: File | null) => void;
};

export function ImageUpload({ label = "Upload Item Photo", previewUrl, onFileChange }: ImageUploadProps) {
  return (
    <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 text-center text-slate-600 sm:p-5">
      {previewUrl ? (
        <span className="mb-3 flex max-h-[280px] w-full items-center justify-center overflow-hidden rounded-md bg-mist p-2">
          <img src={previewUrl} alt="" className="max-h-[260px] w-full object-contain" />
        </span>
      ) : (
        <ImagePlus className="mb-2 h-8 w-8 text-palm" aria-hidden="true" />
      )}
      <span className="text-sm font-semibold">{label}</span>
      <span className="mt-1 text-xs text-slate-500">{previewUrl ? "Tap to change photo" : "Choose a clear product photo"}</span>
      <input
        className="sr-only"
        type="file"
        accept="image/*"
        onChange={(event) => onFileChange?.(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}
