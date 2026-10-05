export default function DashboardPage() {
    return (
        <section>
            <p className="text-sm font-medium text-primary">
                Vista Principal
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Dashboard</h2>

            <p className="mt-2 text-sm text-muted">
                Resumen del seguimiento de Cartas Fianza.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
                <div className="rounded-xl bg-white p-5 shadow-md">
                    <p className="text-sm text-slate-500">Cartas Fianza</p>
                    <p className="mt-2 text-3xl font-semibold">0</p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-md">
                    <p className="text-sm text-slate-500">Cartas activas</p>
                    <p className="mt-2 text-3xl font-semibold">0</p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-md">
                    <p className="text-sm text-slate-500">Próximas a vencer</p>
                    <p className="mt-2 text-3xl font-semibold">0</p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-md">
                    <p className="text-sm text-slate-500">Encaje por Recuperar</p>
                    <p className="mt-2 text-3xl font-semibold">0</p>
                </div>


            </div>
        </section>
    );
}