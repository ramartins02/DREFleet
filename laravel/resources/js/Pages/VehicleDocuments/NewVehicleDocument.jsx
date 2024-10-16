import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import { Button, TextField, Grid, Autocomplete, FormControl, IconButton, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useState } from 'react';

export default function NewVehicleAccessory( {auth, vehicles} ) {

    const [documents, setDocuments] = useState([{}]); // Empty object for dynamic keys

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: '',
        issue_date: '',
        expiration_date: '',
        vehicle_id: '',
        data: {}
    });

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const vehicleList = vehicles.map((vehicle) => {
        return {value: vehicle.id, label: `#${vehicle.id} - ${vehicle.make} ${vehicle.model}, ${vehicle.license_plate}`}
    });

    // Handle dynamic input for title and description
    const handleInputChange = (index, event) => {
        const newDocuments = [...documents];
        // Set the title as the key and description as the value
        if (event.target.name === 'title') {
            const currentKey = newDocuments[index]?.[Object.keys(newDocuments[index])[0]] || '';
            newDocuments[index] = { [event.target.value]: currentKey }; // Update key
        } else if (event.target.name === 'description') {
            const currentKey = Object.keys(newDocuments[index])[0]; // Get current key
            newDocuments[index] = { [currentKey]: event.target.value }; // Update value
        }
        setDocuments(newDocuments);

        // Convert array of objects into a single key-value pair object
        const flattenedData = documents.reduce((acc, doc) => {
            const key = Object.keys(doc)[0];  // Get the key (title)
            const value = doc[key];           // Get the value (description)

            // Only include key-value pairs if both key and value exist
            if (key && value) {
                acc[key] = value;
            }

            return acc;
        }, {});

        // Submit with flattened data (no array, just key-value pairs)
        setData('data', flattenedData);
    };
    
    const addDocument = () => {
        setDocuments([...documents, {}]);  // Add an empty object for a new key-value input
    };

    const removeDocument = (index) => {
        const newDocuments = [...documents];
        newDocuments.splice(index, 1);
        setDocuments(newDocuments);
        setData('data', newDocuments);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('vehicleDocuments.create'));
    };
    
    console.log('data', data);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Novo Documento</h2>}
        >

            {<Head title='Criar Documento' />}

            <div className='py-12'>
                <div className="max-w-7xl mx-auto my-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className='p-6'>

                            <h2>Criar documento de veículo</h2>
                            <form onSubmit={handleSubmit} id="newVehicleForm" noValidate>
                                <input type="hidden" name="_token" value={csrfToken} />

                                <TextField
                                    fullWidth
                                    label="Nome"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name && <InputError message={errors.name} />}
                                    margin="normal"
                                />

                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <InputLabel htmlFor="issue_date" value="Data de Emissão" />
                                        <TextField
                                            id='issue_date'
                                            name='issue_date'
                                            type="date"
                                            fullWidth
                                            value={data.issue_date}
                                            onChange={(e) => setData('issue_date', e.target.value)}
                                            error={errors.issue_date}
                                            helperText={errors.issue_date}
                                            sx={{ mb: 2 }}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <InputLabel htmlFor="expiration_date" value="Data de Validade" />
                                        <TextField
                                            id='expiration_date'
                                            name='expiration_date'
                                            type="date"
                                            fullWidth
                                            value={data.expiration_date}
                                            onChange={(e) => setData('expiration_date', e.target.value)}
                                            error={errors.expiration_date}
                                            helperText={errors.expiration_date}
                                            sx={{ mb: 2 }}
                                        />
                                    </Grid>
                                </Grid>

                                <br />

                                <Autocomplete
                                    id="vehicle"
                                    options={vehicleList}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(e,value) => setData('vehicle_id', value.value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Veículo"
                                            fullWidth
                                            value={data.vehicle_id}
                                            error={errors.vehicle_id}
                                            helperText={errors.vehicle_id}
                                        />
                                    )}
                                    sx={{ mb: 2 }}
                                />

                                <FormControl fullWidth margin='normal'>
                                    {documents.map((elem, index) => (
                                        <Grid container spacing={2} key={index}>
                                            <Grid item xs={12}>
                                                <Typography>
                                                    Dados Adicionais {index + 1}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <TextField 
                                                    fullWidth
                                                    label={`Título ${index + 1}`}
                                                    name="title"
                                                    value={Object.keys(elem)[0] || ''}
                                                    onChange={(event) => handleInputChange(index, event)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <TextField 
                                                    fullWidth
                                                    label={`Descrição ${index + 1}`}
                                                    name="description"
                                                    value={Object.values(elem)[0] || ''}
                                                    onChange={(event) => handleInputChange(index, event)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button 
                                                    variant="contained"
                                                    color="error" 
                                                    onClick={() => removeDocument(index)} 
                                                    disabled={documents.length < 2}
                                                    sx={{ marginBottom: 2 }}
                                                    startIcon={<Remove />}
                                                >
                                                    Remover
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Button onClick={addDocument} startIcon={<Add />}>
                                        Adicionar Dados
                                    </Button>
                                </FormControl>
                                <br/>

                                <Button variant="outlined" type="submit" disabled={processing}>
                                    Submeter
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
