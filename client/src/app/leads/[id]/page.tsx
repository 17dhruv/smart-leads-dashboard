import { LeadDetailScreen } from "../../../features/leads/LeadDetailScreen";

interface LeadPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeadPage({ params }: LeadPageProps) {
  const { id } = await params;

  return <LeadDetailScreen id={id} />;
}
