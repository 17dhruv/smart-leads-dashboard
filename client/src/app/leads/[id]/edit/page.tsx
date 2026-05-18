import { LeadFormScreen } from "../../../../features/leads/LeadFormScreen";

interface EditLeadPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditLeadPage({ params }: EditLeadPageProps) {
  const { id } = await params;

  return <LeadFormScreen id={id} mode="edit" />;
}
