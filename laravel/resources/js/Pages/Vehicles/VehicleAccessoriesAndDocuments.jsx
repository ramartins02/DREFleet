import Table from '@/Components/Table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';

export default function VehicleAccessoriesAndDocuments( {auth, vehicle, flash} ) {
    console.log(vehicle)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

    useEffect(() => {
        if (flash.message || flash.error) {
            setSnackbarMessage(flash.message || flash.error);
            setSnackbarSeverity(flash.error ? 'error' : 'success');
            setOpenSnackbar(true);
        }
    }, [flash]);

    //Deconstruct props to send to Table
    const vehicleDocs = vehicle.documents.map((doc) => {
        // Parse the JSON data field for each document
        const additionalData = doc.data
            ? Object.entries(doc.data).map(([key, value]) => `${key}: ${value}`).join("\n")
            : [];
    
        return {
            id: doc.id,
            name: doc.name,
            issue_date: doc.issue_date,
            expiration_date: doc.expiration_date,
            expired: doc.expired,
            additionalData: additionalData,
            created_at: doc.created_at,
            updated_at: doc.updated_at,
        };
    });

    const vehicleDocsColumnLabels = {
        id: 'ID',
        name: 'Nome',
        issue_date: 'Data de Emissão',
        expiration_date: 'Data de Validade',
        expired: 'Expirado',
        additionalData: 'Dados adicionais',
        created_at: 'Data de Criação',
        updated_at: 'Data da Última Atualização',
    };
    
    const vehicleAccessories = vehicle.accessories.map((acc) => {
        return {
            id: acc.id,
            name: acc.name,
            condition: acc.condition,
            expiration_date: acc.expiration_date,
            created_at: acc.created_at,
            updated_at: acc.updated_at,
        }
    });

    const vehicleAccColumnLabels = {
        id: 'ID',
        name: 'name',
        condition: 'Condição',
        expiration_date: 'Data de Validade',
        created_at: 'Data de Criação',
        updated_at: 'Data da Última Atualização',

    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Documentos e Accessórios do Veículo #{vehicle.id}</h2>}
        >

            {<Head title='Documentos e Acessórios de Veículo' />}

            <div className="py-12 px-6">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    
                    <div className="py-12 px-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

                            <Button href={route('vehicleDocuments.showCreate')}>
                                <AddIcon />
                                <a className="font-medium text-sky-600 dark:text-sky-500 hover:underline">
                                    Novo Documento
                                </a>
                            </Button>

                            <Table
                                data={vehicleDocs}
                                columnsLabel={vehicleDocsColumnLabels}
                                editAction="vehicleDocuments.showEdit"
                                deleteAction="vehicleDocuments.delete"
                                dataId="id" // Ensure the correct field is passed for DataGrid's `id`
                            />
                        </div>
                    </div>

                    <div className="py-12 px-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <Button href={route('vehicleAccessories.showCreate')}>
                                <AddIcon />
                                <a className="font-medium text-sky-600 dark:text-sky-500 hover:underline">
                                    Novo Acessório
                                </a>
                            </Button>

                            <Table
                                data={vehicleAccessories}
                                columnsLabel={vehicleAccColumnLabels}
                                editAction="vehicleAccessories.showEdit"
                                deleteAction="vehicleAccessories.delete"
                                dataId="id" // Ensure the correct field is passed for DataGrid's `id`
                            />
                        </div>
                    </div>

                </div>
            </div>
 
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert variant='filled' onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </AuthenticatedLayout>

    )
}