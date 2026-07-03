import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
      <Suspense fallback={<div className="w-full rounded-lg bg-white p-5 text-sm font-semibold text-slate-500 shadow-soft">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
