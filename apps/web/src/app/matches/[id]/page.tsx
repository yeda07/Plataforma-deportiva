import type { Identifier } from "@competencias-platform/contracts";
import { MatchDetailsPage as MatchDetailsFeaturePage, getMatchDetails } from "@features/matches";
import { notFound } from "next/navigation";

type MatchDetailsPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export default async function MatchDetailsRoutePage({ params }: MatchDetailsPageProps) {
  const { id } = await params;
  const data = await getMatchDetails(id as Identifier);

  if (!data) {
    notFound();
  }

  return <MatchDetailsFeaturePage data={data} />;
}
