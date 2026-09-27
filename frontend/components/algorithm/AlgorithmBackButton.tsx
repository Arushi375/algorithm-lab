"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type AlgorithmBackButtonProps = {
  label?: string;
};

export default function AlgorithmBackButton({
  label = "Back",
}: AlgorithmBackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" />

      <span>{label}</span>
    </button>
  );
}