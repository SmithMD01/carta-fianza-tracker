import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { mockGuarantees } from "@/data/mock-guarantees";

export default function DashboardPage() {
  return (
    <section>
      <p className="text-sm font-medium text-primary">Vista principal</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        Resumen operativo del seguimiento de cartas fianza.
      </p>

      <DashboardOverview guarantees={mockGuarantees} />
    </section>
  );
}
