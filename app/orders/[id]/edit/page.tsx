import { EditOrderClient } from "@/components/EditOrderClient";

type EditOrderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditOrderPage({ params }: EditOrderPageProps) {
  const { id } = await params;
  return <EditOrderClient id={id} />;
}
