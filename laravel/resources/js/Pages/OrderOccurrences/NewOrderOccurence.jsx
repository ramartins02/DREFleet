import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Autocomplete, Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Grid, } from '@mui/material';

export default function NewOrderOccurrence({ auth, orders }) {
    
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        type: '',
        vehicle_towed: '',
        description: '',
        order_id: '',
    });

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const orderList = orders.map((order) => {
        return {
            value: order.id, 
            label: 
                `Pedido id ${order.id}: - ${order.expected_begin_date} a ${order.expected_end_date} ` +
                `|| Veículo id ${order.vehicle.id}: ${order.vehicle.make} ${order.vehicle.model} ${order.vehicle.license_plate} ` +
                `|| Condutor id ${order.driver.user_id}: ${order.driver.name} ${order.driver.license_number}`
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('orderOccurrences.create'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Nova Ocorrência</h2>}
        >

            {<Head title='Criar Ocorrência' />}

            <div className='py-12'>
                <div className="max-w-7xl mx-auto my-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className='p-6'>

                            <h2>Criar ocorrência</h2>
                            <form onSubmit={handleSubmit} id="newOrderOccurrenceForm" noValidate>
                                <input type="hidden" name="_token" value={csrfToken} />

                                <Autocomplete
                                    id="order_id"
                                    options={orderList}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(e,value) => setData('order_id', value.value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Pedido"
                                            fullWidth
                                            value={data.order_id}
                                            error={errors.order_id}
                                            helperText={errors.order_id}
                                        />
                                    )}
                                    sx={{ mb: 2 }}
                                />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={8}>
                                        <FormControl component="fieldset" margin="normal">
                                            <FormLabel component="legend">Tipo de Ocorrência</FormLabel>
                                            <RadioGroup
                                                name="type"
                                                value={data.type}
                                                onChange={(e) => setData('type', e.target.value)}
                                                style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} // Use flexbox
                                                error={errors.type}
                                                helperText={errors.type}
                                            >
                                                    <FormControlLabel value="Reparações" control={<Radio />} label="Reparações" />
                                                    <FormControlLabel value="Lavagens" control={<Radio />} label="Lavagens" />
                                                    <FormControlLabel value="Manutenções" control={<Radio />} label="Manutenções" />
                                                    <FormControlLabel value="Outros" control={<Radio />} label="Outros" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <FormControl component="fieldset" margin="normal">
                                    <FormLabel component="legend">Veículo Rebocado</FormLabel>
                                    <RadioGroup
                                        name="vehicle_towed"
                                        value={data.vehicle_towed}
                                        onChange={(e) => setData('vehicle_towed', e.target.value)}
                                        style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} // Use flexbox
                                        error={errors.vehicle_towed}
                                        helperText={errors.vehicle_towed}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column'}}>
                                            <FormControlLabel value="1" control={<Radio />} label="Sim" />
                                            <FormControlLabel value="0" control={<Radio />} label="Não" />
                                        </div>
                                    </RadioGroup>
                                </FormControl>

                                <br />
                                
                                <TextField
                                    label="Descrição da Ocorrência"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={data.description}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        // Check if the new value length is less than or equal to 500
                                        if (newValue.length <= 500) {
                                            setData('description', newValue); // Update state
                                        }
                                    }}
                                    error={errors.description}
                                    helperText={errors.description}
                                    sx={{ mb: 2 }}
                                />

                                {/* Character Counter */}
                                <div style={{ textAlign: 'right', color: data.description.length >= 500 ? 'red' : 'black' }}>
                                    {500 - data.description.length} caracteres restantes
                                </div>

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