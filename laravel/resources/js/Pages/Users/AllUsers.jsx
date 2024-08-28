import Table from '@/Components/Table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AllDrivers( {auth, users} ) {
    
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    //Deconstruct data to send to table component
    let cols;
    let userInfo = users.map((user) => (
        {id: user.id, name: user.name, email: user.email, phone: user.phone, user_type: user.user_type , status_code: user.status_code }
    ))

    const userColumnLabels = {
        id: 'ID',
        name: 'Nome',
        email: 'Email',
        phone: 'Numero de Telefone',
        user_type: 'Tipo de Utilizador',
        status_code: 'Estado'
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Utilizadores</h2>}
        >

            <Head title="Utilizadores" />
        
            <div className='m-2 p-6'>
                <a href={route('users.create')} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                    Novo Utilizador
                </a>

                <Table data={userInfo} columnsLabel={userColumnLabels} editAction="users.showEdit" deleteAction="users.delete" dataId="id"/>
            </div>
        </AuthenticatedLayout>
    );
}