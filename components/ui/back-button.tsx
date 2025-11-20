"use client"

import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return <Button className="my-4" onClick={() => router.back()}>Back</Button>;
}
