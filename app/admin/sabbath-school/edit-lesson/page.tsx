import { Suspense } from "react";
import EditLessonClient from "@/components/admin/EditLessonClient";

export const dynamic = "force-dynamic";

export default function EditLessonPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading lesson...</div>}>
      <EditLessonClient />
    </Suspense>
  );
}
