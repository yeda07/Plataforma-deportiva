import { Suspense } from "react";
import { Skeleton } from "@competencias-platform/ui";
import { MatchesPage } from "@features/matches";

export default function MatchesRoutePage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <MatchesPage />
    </Suspense>
  );
}
