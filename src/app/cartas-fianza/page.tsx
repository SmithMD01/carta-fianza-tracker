import { getGuarantees } from "@/lib/guarantees/guarantee-repository";
import { GuaranteesExplorer } from "@/components/guarantees/guarantees-explorer";
import { GuaranteeCreateModal } from "@/components/guarantees/guarantee-create-modal";
import { getProjects } from "@/lib/projects/project-repository";
import { getFinancialEntities } from "@/lib/financial-entities/financial-entity-repository";

export const dynamic = "force-dynamic";

export default async function CartasFianzaPage() {
    const [projects, guarantees, financialEntities] = await Promise.all([
    getProjects(),
    getGuarantees(),
    getFinancialEntities(),
    ]);

    return (
        <section>
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
            <p className="text-sm font-medium text-primary">
                Gestión
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                Cartas Fianza
            </h1>

            <p className="mt-1 text-sm text-muted">
                Lista de cartas fianza registradas
            </p>
            </div>

            <div className="flex justify-end gap-2">
            <GuaranteeCreateModal projects={projects} />

            <button className="inline-flex h-10 min-w-[165px] items-center justify-center whitespace-nowrap rounded-lg border border-success bg-success px-3 text-sm font-medium text-white hover:bg-success/80">
                Exportar Excel
            </button>
            </div>
        </header>

        <GuaranteesExplorer guarantees={guarantees} financialEntities={financialEntities} />
        </section>
    );
    }