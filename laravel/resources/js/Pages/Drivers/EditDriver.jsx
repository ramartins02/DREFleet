import React, { useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Grid } from '@mui/material';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import LicenseNumberInput from '@/Components/LicenseNumberInput';

{/*TODO: HEAVY LICENSE AND LICENSE TYPE NEXT TO EACH OTHER*/}
{/*TODO: IMPROVE LICENSE NUMBER FIELDS LOOK*/}
{/*TODO: LICENSE NUMBER FIELDS ERROR POSITIONS*/}
{/*TODO: LICENSE NUMBER FIELDS SHOWING CORRECTLY*/}
{/*TODO: SPACE BETWEEN MIDDLE AND LAST DIGITS*/}
export default function EditDriver({ auth, driver }) {

    //console.log(driver)
    // Inertia's built-in useForm hook to manage form data, actions, errors
    // Define data to be sent to the backend
    const { data, setData, put, errors, processing } = useForm({
        user_id: driver.user_id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        license_number: driver.license_number,
        heavy_license: driver.heavy_license,
        heavy_license_type: driver.heavy_license_type,
        status: driver.status,
    });

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(name, type === 'radio' ? value : value);
    };

    const handleLicenseChange = (license) => {
        console.log('license', license)
        setData('license_number', license)
    };

    const handleHeavyChange = () => {
        if(data.heavy_license != 1)
            setData('heavy_license_type', null)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        handleHeavyChange();
        put(route('drivers.edit', driver.user_id));
    };

    return(
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Condutor #{driver.user_id}</h2>}
        >

            {<Head title='Editar Condutor' />}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <form onSubmit={handleSubmit}>
                            <input type="hidden" name="_token" value={csrfToken} />
                            <input type="hidden" name="_method" value="PUT" />
                            <input type="hidden" name="user_id" value={driver.user_id} />     

                            <TextField
                                label="Nome"
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                error={Boolean(errors.name)}
                                helperText={errors.name  && <InputError message={errors.name} /> }
                            />

                            <TextField
                                label="Email"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                type="email"
                                error={Boolean(errors.email)}
                                helperText={errors.email  && <InputError message={errors.email} />}
                            />

                            <TextField
                                label="Número de telemóvel"
                                id="phone"
                                name="phone"
                                value={data.phone}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                type="tel"
                                error={Boolean(errors.phone)}
                                helperText={errors.phone && <InputError message={errors.phone} />}
                            />

                            <LicenseNumberInput value={data.license_number} onChange={handleLicenseChange} />
                            
                            <FormControl component="fieldset" margin="normal">
                                <FormLabel component="legend">Carta de Pesados</FormLabel>
                                <RadioGroup
                                    name="heavy_license"
                                    value={data.heavy_license}
                                    onChange={handleChange}
                                    row
                                >
                                    <FormControlLabel
                                        value="0"
                                        control={<Radio />}
                                        label="Não"
                                    />
                                    <FormControlLabel
                                        value="1"
                                        control={<Radio />}
                                        label="Sim"
                                    />
                                </RadioGroup>
                            </FormControl>
                            <br/>

                            <FormControl component="fieldset" margin="normal" disabled={data.heavy_license == '0'}>
                                <FormLabel component="legend">Tipo de Carta de Pesados</FormLabel>
                                <RadioGroup
                                    name="heavy_license_type"
                                    value={data.heavy_license_type}
                                    onChange={handleChange}
                                    row
                                >
                                    <FormControlLabel
                                        value="Mercadorias"
                                        control={<Radio />}
                                        label="Mercadorias"
                                    />
                                    <FormControlLabel
                                        value="Passageiros"
                                        control={<Radio />}
                                        label="Passageiros"
                                    />
                                </RadioGroup>
                            </FormControl>
                            <br/>

                            <FormControl component="fieldset" margin="normal">
                                <FormLabel component="legend">Estado</FormLabel>
                                <RadioGroup
                                    name="status"
                                    value={data.status}
                                    onChange={handleChange}
                                    row
                                >
                                    <FormControlLabel
                                        value="Disponível"
                                        control={<Radio />}
                                        label="Disponível"
                                    />
                                    <FormControlLabel
                                        value="Indisponível"
                                        control={<Radio />}
                                        label="Indisponível"
                                    />
                                    <FormControlLabel
                                        value="Em Serviço"
                                        control={<Radio />}
                                        label="Em Serviço"
                                    />
                                    <FormControlLabel
                                        value="Escondido"
                                        control={<Radio />}
                                        label="Escondido"
                                    />
                                </RadioGroup>
                            </FormControl>
                            <br/>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={processing}
                            >
                                Submeter
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}