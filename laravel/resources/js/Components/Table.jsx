import React from 'react';
import { DataGrid, GridToolbar, } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { ptPT } from '@mui/x-data-grid/locales';
import MapModal from './MapModal';
import ErrorIcon from '@mui/icons-material/Error';
import { parse, isBefore } from 'date-fns';
import { pt } from 'date-fns/locale';
import MouseHoverPopover from './MouseHoverPopover';
import OccurrenceModal from './OccurrenceModal';
import { Link } from '@inertiajs/react';

// Custom table using Material UI's DataGrid
const Table = ({ data, columnsLabel = {}, editAction, deleteAction, dataId }) => {

    // Define DataGrid columns based on columnsLabel
    // columns can be different depending on the information provided and thus need to render different elements
    const columns = Object.keys(columnsLabel).map(key => ({
        field: key,
        headerName: columnsLabel[key],
        editable: false,
        flex: 1,
        renderCell: (params) => {
            //console.log(params)              Use this console log for debugging purposes         
            // Display kids_ids as buttons that direct to the respective kid's page
            // Shown in Places "table"
            if (key === 'kids_ids') {
                return (
                    <div>
                        {params.value.map((kid) => (
                            <Link
                                key={kid.id}
                                href={route('kids.showEdit', kid)}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        maxWidth: '30px',
                                        maxHeight: '30px',
                                        minWidth: '30px',
                                        minHeight: '30px',
                                        margin: '0px 4px'
                                    }}
                                >
                                    {kid.id}
                                </Button>
                            </Link>
                        ))}
                    </div>
                );
            }
            // Display place_ids as buttons that direct to the respective place's page
            // Shown in Kids "table"
            else if (key === 'place_ids') {
                return (
                    <div>
                        {params.value.map((kid) => (
                            <Link
                                key={kid.id}
                                href={route('places.showEdit', kid)}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        maxWidth: '30px',
                                        maxHeight: '30px',
                                        minWidth: '30px',
                                        minHeight: '30px',
                                        margin: '0px 4px'
                                    }}
                                >
                                    {kid.id}
                                </Button>
                            </Link>
                        ))}
                    </div>
                );
            }
            else if(key == 'place_id'){
                return (
                    <div>
                        <Link
                            key={params.value}
                            href={route('places.showEdit', params.value)}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    maxWidth: '30px',
                                    maxHeight: '30px',
                                    minWidth: '30px',
                                    minHeight: '30px',
                                    margin: '0px 4px'
                                }}
                            >
                                {params.value}
                            </Button>
                        </Link>
                    </div>
                )
            }
            // Display kidsList with buttons, each button redirecting to the respective kid's page
            // Shown in Technician "table"
            else if (key === 'kidsList1' || key === 'kidsList2') {
                return (
                    <div>
                        {params.value.map((kid) => (
                            <Link
                                key={kid.id}
                                href={route('kids.showEdit', kid)}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        maxWidth: '30px',
                                        maxHeight: '30px',
                                        minWidth: '30px',
                                        minHeight: '30px',
                                        margin: '0px 4px'
                                    }}
                                >
                                    {kid.id}
                                </Button>
                            </Link>
                        ))}
                    </div>
                );
            }
            // Display trajectory using a Modal
            // Shown in Orders 'table'
            else if(key == 'trajectory'){
                return (
                    <MapModal trajectory={params.value}/>
                )
            }
            else if(key == 'orderArea'){
                return (
                    <MapModal route={params.value}/>
                )
            }
            //Display vehicle id as a Button to redirect to the respective vehicle
            //Shown in vehicle Accessories and Vehicle Documents 'table'
            else if(key == 'vehicle_id'){
                return (
                    <div>
                        <Link
                            key={params.value}
                            href={route('vehicles.showEdit', params.value)}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    maxWidth: '30px',
                                    maxHeight: '30px',
                                    minWidth: '30px',
                                    minHeight: '30px',
                                    margin: '0px 4px'
                                }}
                            >
                                {params.value}
                            </Button>
                        </Link>
                    </div>
                )
            }
            else if(key == 'driver_id'){
                return (
                    <div>
                        <Link
                            key={params.value}
                            href={route('drivers.showEdit', params.value)}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    maxWidth: '30px',
                                    maxHeight: '30px',
                                    minWidth: '30px',
                                    minHeight: '30px',
                                    margin: '0px 4px'
                                }}
                            >
                                {params.value}
                            </Button>
                        </Link>
                    </div>
                )
            }
            else if(key == 'technician_id'){
                return (
                    <div>
                        <Link
                            key={params.value}
                            href={route('technicians.showEdit', params.value)}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    maxWidth: '30px',
                                    maxHeight: '30px',
                                    minWidth: '30px',
                                    minHeight: '30px',
                                    margin: '0px 4px'
                                }}
                            >
                                {params.value}
                            </Button>
                        </Link>
                    </div>
                )
            }
            else if (key === 'expiration_date' || key === 'license_expiration_date') {
                const parsedDate = parse(params.value, 'dd-MM-yyyy', new Date(), { locale: pt });
                const now = new Date();
                
                if (isBefore(parsedDate, now)) {
                    return (
                        <div style={{ color: 'red' }}>
                            <ErrorIcon style={{ marginRight: '4px', color: 'red', fontWeight: 'bolder' }} />
                            {params.value}
                        </div>
                    );
                }
                return params.value
            }
            else if(key == 'approved_by'){
                if(params.value==null) return params.value
                return (
                    <div>
                        <Link
                            key={params.value}
                            href={route('managers.showEdit', params.value)}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    maxWidth: '30px',
                                    maxHeight: '30px',
                                    minWidth: '30px',
                                    minHeight: '30px',
                                    margin: '0px 4px'
                                }}
                            >
                                {params.value}
                            </Button>
                        </Link>
                    </div>
                )
            }
            else if(key == 'order_id'){
                return (
                    <div>
                        <Link
                            key={params.value}
                            href={route('orders.showEdit', params.value)}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    maxWidth: '30px',
                                    maxHeight: '30px',
                                    minWidth: '30px',
                                    minHeight: '30px',
                                    margin: '0px 4px'
                                }}
                            >
                                {params.value}
                            </Button>
                        </Link>
                    </div>
                )
            }
            else if(key == 'route'){
                if(params.value != '-'){
                    return (
                        <div>
                            <Link
                                key={params.value}
                                href={route('orderRoutes.showEdit', params.value)}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        maxWidth: '30px',
                                        maxHeight: '30px',
                                        minWidth: '30px',
                                        minHeight: '30px',
                                        margin: '0px 4px'
                                    }}
                                >
                                    {params.value}
                                </Button>
                            </Link>
                        </div>
                    )
                } else{
                    return (
                        <div></div>
                    )
                }
            }
            else if(key === 'all_approved_orders'){
                return (
                    <div>
                        <Link
                            key={params.value}
                            href={route('managers.approved', params.value)}
                        >
                            <Button                
                                variant="outlined"
                                sx={{
                                    maxHeight: '30px',
                                    minHeight: '30px',
                                    margin: '0px 4px'
                                }}
                            >
                                Consultar
                            </Button>
                        </Link>
                    </div>
                )
            }
            else if(key === 'vehicle_accesories_docs'){
                return (
                    <div>
                        <Link
                            key={params.value}
                            href={route('vehicles.documentsAndAccessories', params.value)}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    maxHeight: '30px',
                                    minHeight: '30px',
                                    margin: '0px 4px'
                                }}
                            >
                                Consultar
                            </Button>
                        </Link>
                    </div>
                )
            }
            else if(key === 'vehicle_kilometrage_reports'){
                return (
                    <div>
                        <Link
                            key={params.value}
                            href={route('vehicles.kilometrageReports', params.value)}
                        >
                        <Button
                            variant="outlined"
                            sx={{
                                maxHeight: '30px',
                                minHeight: '30px',
                                margin: '0px 4px'
                            }}
                        >
                            Consultar
                        </Button>
                        </Link>
                    </div>
                )
            }
            else if(key === 'vehicle_maintenance_reports'){
                return (
                    <div>
                        <Button
                            key={params.value}
                            variant="outlined"
                            href={route('vehicles.maintenanceReports', params.value)}
                            sx={{
                                maxHeight: '30px',
                                minHeight: '30px',
                                margin: '0px 4px'
                            }}
                        >
                            Consultar
                        </Button>
                    </div>
                )
            }
            else if(key === 'kid_contacts'){
                return (
                    <div>
                        <Link
                            key={params.value}
                            href={route('kids.contacts', params.value)}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    maxHeight: '30px',
                                    minHeight: '30px',
                                    margin: '0px 4px'
                                }}
                            >
                                Consultar
                            </Button>
                        </Link>
                    </div>
                )
            }
            else if (key === 'occurrences') {
                const occurences = params.value
                // Only render the button if there are occurrences
                if(occurences.length > 0){
                    return (
                        <div>
                            <OccurrenceModal occurences={occurences} link={params.row.id}/>
                        </div>
                    );
                } else {
                    return null; // Don't render anything if there are no occurrences
                }
            }
            else if (key === 'current_month_fuel_requests') {
                return (
                    <div>
                        <Link
                            href={route('vehicles.refuelRequests', params.row.id)}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    maxHeight: '30px',
                                    minHeight: '30px',
                                    margin: '0px 4px'
                                }}
                            >
                                {params.value} (Ver todos) {/* Display the number of occurrences */}
                            </Button>
                        </Link>
                    </div>
                );
            }
            else if (key === 'stops') {
                // Only render the button if there are occurrences
                if (params.value > 0) {
                    return (
                        <div>
                            <Link
                                key={params.value}
                                href={route('orders.stops', params.row.id)}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        maxHeight: '30px',
                                        minHeight: '30px',
                                        margin: '0px 4px'
                                    }}
                                >
                                    {params.value} Paragem(ns) {/* Display the number of occurrences */}
                                </Button>
                            </Link>
                        </div>
                    );
                }
            }
            // Display drivers with buttons, each button redirecting to the respective drivers's page
            // Shown in OrderRoutes "table"
            else if (key === 'drivers') {
                return (
                    <div>
                        {params.value.map((driver) => (
                            <Link
                                key={driver.user_id}
                                href={route('drivers.showEdit', driver)}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        maxWidth: '30px',
                                        maxHeight: '30px',
                                        minWidth: '30px',
                                        minHeight: '30px',
                                        margin: '0px 4px'
                                    }}
                                >
                                    {driver.user_id}
                                </Button>
                            </Link>
                        ))}
                    </div>
                );
            }
            // Display technicians with buttons, each button redirecting to the respective technician's page
            // Shown in OrderRoutes "table"
            else if (key === 'technicians') {
                return (
                    <div>
                        {params.value.map((tech) => (
                            <Link
                                key={tech.id}
                                href={route('technicians.showEdit', tech)}
                            >
                                <Button
                                    //key={tech.id}
                                    variant="outlined"
                                    //href={route('technicians.showEdit', tech)}
                                    sx={{
                                        maxWidth: '30px',
                                        maxHeight: '30px',
                                        minWidth: '30px',
                                        minHeight: '30px',
                                        margin: '0px 4px'
                                    }}
                                >
                                    {tech.id}
                                </Button>
                            </Link>
                        ))}
                    </div>
                );
            }
            else if(key === 'coordinates'){
                return (
                    <div>
                        <span>{params.value}</span>

                    </div>
                )
            }
            else if(key === 'description'){
                return (
                    <div>
                        <MouseHoverPopover data={params.value} />
                    </div>
                )
            }

            return params.value;
        }
    }));
    // Add static column with Edit and Delete buttons
    if (editAction || deleteAction) {
        columns.push({
            field: 'actions',
            headerName: 'Ações',
            renderCell: (params) => (
                <div>
                    {editAction && 
                        <a
                            href={route(editAction, params.row.id)}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                            Editar
                        </a>
                    }
                    {deleteAction && 
                        <button
                            onClick={() => handleDelete(params.row.id)}
                            className="ml-4 font-medium text-red-600 dark:text-red-500 hover:underline"
                        >
                            Eliminar
                        </button>
                    }
                </div>
            ),
            sortable: false, // Disable sorting for actions column
            minWidth: 150, // Adjust as needed
        });
    }

    const rows = data.map((elem) => ({
        id: elem[dataId], // DataGrid requires an 'id' field
        ...elem
    }));

    // Method to handle delete
    const handleDelete = async (id) => {

        if (window.confirm('Tem a certeza que pretende eliminar o elemento com id ' + id + '?')) {

            const form = document.createElement('form');
            form.action = route(deleteAction, id);
            form.method = 'POST';
    
            // Add hidden inputs for the method and CSRF token
            const methodInput = document.createElement('input');
            methodInput.type = 'hidden';
            methodInput.name = '_method';
            methodInput.value = 'DELETE';
    
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
            form.appendChild(methodInput);
            form.appendChild(csrfInput);
    
            document.body.appendChild(form);
            form.submit();
        }
    };

    return (
        <div style={{ display: 'flex'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 25,},
                    },
                }}
                pagination
                disableSelectionOnClick
                autosizeOnMount
                density='compact'
                disableDensitySelector
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                    },
                }}
                ignoreDiacritics={true}
                //loading                           //loading can be used when fetching data
                hideFooterSelectedRowCount
                localeText={ptPT.components.MuiDataGrid.defaultProps.localeText}
                // Table header styling was from github Issue https://github.com/mui/mui-x/issues/898#issuecomment-1498361362
                // Currently there is no simple way to change header text warp
                sx={{
                    "& .MuiDataGrid-columnHeaderTitle": {
                        whiteSpace: "nowrap",
                        lineHeight: "normal",
                        marginTop: "12px", 
                        marginBottom: "12px", color: "#A6A6A6", fontSize: 12, textTransform: "uppercase", fontWeight:"500", fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif", letterSpacing: "0.05em"
                    },
                //    "& .MuiDataGrid-columnHeader": {
                //        // Forced to use important since overriding inline styles
                //        height: "unset !important"
                //    },
                //    "& .MuiDataGrid-columnHeaders": {
                //        // Forced to use important since overriding inline styles
                //        maxHeight: "168px !important"
                //    },
                    fontSize: 14
                }}
            />
        </div>
    );
};

export default Table;
