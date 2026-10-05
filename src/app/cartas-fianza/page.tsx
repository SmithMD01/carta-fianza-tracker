import { mockGuarantees } from "@/data/mock-guarantees";
import { GuaranteesExplorer } from "@/components/guarantees/guarantees-explorer";
import { GuaranteeCreateModal } from "@/components/guarantees/guarantee-create-modal";


export default function CartasFianzaPage() {
    return (
        <section>
            <header>
                <p className="text-sm font-medium text-primary">Gestión</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">Cartas Fianza</h1>
                <p className="mt-2 text-sm text-muted">Lista de cartas fianza registradas</p>

                <GuaranteeCreateModal />
                <button className="ml-2 mt-4 rounded-lg bg-success px-4 py-2 text-sm font-medium text-white border hover:bg-secondary/80">
                    Exportar Excel
                </button>
            </header>


            <section className="mt-8 rounded-xl border border-border bg-surface-muted px-5 py-4">
                <h2 className="text-sm font-semibold text-foreground">Resumen de Resultados</h2>

                <p className="mt-2 text-sm text-muted">Selecciona una pregunta para filtrar la Información</p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-surface px-4 py-3">
                        <p className="text-sm font-medium text-foreground">Registros Visibles</p>
                        <p className="mt-1 text-2xl font-bold text-primary">{mockGuarantees.length}</p>
                        <p className="mt-1 text-sm text-muted">Registros encontrados</p>
                    </div>

                    <div className="rounded-lg bg-surface px-4 py-3">
                        <p className="text-sm font-medium text-foreground">Valor de Cartas</p>
                        <p className="mt-1 text-2xl font-bold text-primary"> S/{mockGuarantees.reduce((total, guarantee) => total + guarantee.guaranteeValue, 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="mt-1 text-sm text-muted">Valor total registrado</p>   
                    </div>
                </div>

            </section>

            <GuaranteesExplorer guarantees={mockGuarantees} />

        </section>

    );
}