import { Head, Link } from '@inertiajs/react';
import LeafletMap from '@/Components/LeafletMap';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import 'leaflet/dist/leaflet.css';

export default function OrderIndex({auth}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Rotas</h2>}
        >

            <Head title="Rotas" />
        
            <div className="m-auto py-12 w-4/5">
                <div className="overflow-hidden shadow-lg sm:rounded-lg">
                    <LeafletMap/>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}