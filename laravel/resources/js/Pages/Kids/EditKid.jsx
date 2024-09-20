import React, { useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button, Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, ListItemText, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField } from '@mui/material';import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function EditKid({auth, kid, availablePlaces}) {

    const [selectedAddPlaces, setSelectedAddPlaces] = useState([]);                 // state variable that holds the places to be added
    const [selectedRemovePlaces, setSelectedRemovePlaces] = useState([]);           // state variable that holds the places to be removed
    //console.log(kid)
    // Inertia's built-in useForm hook to manage form data, actions, errors
    // Define data to be sent to the backend
    const { data, setData, put, errors, processing } = useForm({
        name: kid.name,
        email: kid.email,
        phone: kid.phone,
        wheelchair: kid.wheelchair,
        addPlaces: [],
        removePlaces: [],
    });

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(name, type === 'radio' ? value : value);
    };

    // Handle changes when a place is added
    const handleAddPlacesChange = (event) => {
        const newSelectedAddPlaces = event.target.value;
        setSelectedAddPlaces(newSelectedAddPlaces);
        setData('addPlaces', newSelectedAddPlaces);
    };
    
    // Handle changes when a place is removed
    const handleRemovePlacesChange = (event) => {
        const newSelectedRemovePlaces = event.target.value;
        setSelectedRemovePlaces(newSelectedRemovePlaces);
        setData('removePlaces', newSelectedRemovePlaces);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('kids.edit', kid.id));
    };

    return(
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Criança #{kid.id}</h2>}
        >

            {/*<Head title={'Condutor'} />*/}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <form onSubmit={handleSubmit}>
                            <input type="hidden" name="_token" value={csrfToken} />

                            <TextField
                                label="Nome"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name && <InputError message={errors.name} />}
                            />

                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email && <InputError message={errors.email} />}
                            />

                            <TextField
                                label="Número de telemóvel"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                id="phone"
                                name="phone"
                                value={data.phone}
                                onChange={handleChange}
                                error={!!errors.phone}
                                helperText={errors.phone && <InputError message={errors.phone} />}
                            />

                            <FormControl component="fieldset" margin="normal">
                                <FormLabel component="legend">Utiliza cadeira de rodas?</FormLabel>
                                <RadioGroup
                                    aria-label="wheelchair"
                                    name="wheelchair"
                                    value={data.wheelchair}
                                    onChange={handleChange}
                                    row
                                >
                                    <FormControlLabel value="0" control={<Radio />} label="Não" />
                                    <FormControlLabel value="1" control={<Radio />} label="Sim" />
                                </RadioGroup>
                                {errors.wheelchair && <InputError message={errors.wheelchair} />}
                            </FormControl>


                            <p>Adicionar Morada</p>
                            <FormControl sx={{ m: 1, minWidth: 300 }}>
                                <InputLabel id="add-places-label">Adicionar Morada</InputLabel>
                                <Select
                                    labelId="add-places-label"
                                    id="addPlaces"
                                    multiple
                                    value={selectedAddPlaces}
                                    onChange={handleAddPlacesChange}
                                    input={<OutlinedInput label="Adicionar Morada" />}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {availablePlaces.map((place) => (
                                        <MenuItem key={place.id} value={place.id}>
                                            <Checkbox checked={selectedAddPlaces.indexOf(place.id) > -1} />
                                            <ListItemText primary={`#${place.id} - ${place.address}`} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <p>Retirar Morada</p>
                            <FormControl sx={{ m: 1, minWidth: 300 }}>
                                <InputLabel id="remove-places-label">Retirar Morada</InputLabel>
                                <Select
                                    labelId="remove-places-label"
                                    id="removePlaces"
                                    multiple
                                    value={selectedRemovePlaces}
                                    onChange={handleRemovePlacesChange}
                                    input={<OutlinedInput label="Retirar Morada" />}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {kid.places.map((place) => (
                                        <MenuItem key={place.id} value={place.id}>
                                            <Checkbox checked={selectedRemovePlaces.indexOf(place.id) > -1} />
                                            <ListItemText primary={`#${place.id} - ${place.address}`} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <br/>

                            <Button type="submit" variant="outlined" disabled={processing}>Submeter</Button>
                        </form>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}