import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useRef } from 'react';
import { Column } from 'primereact/column';
import { ProductService } from '../service/ProductService';
import { useGlobalState } from '../state';

export const LoadDetails = () => {

    const [myRoutes, setMyRoutes] = useState(null);

    const [userData, setUserData] = useGlobalState("userData");

    useEffect(() => {
        const productService = new ProductService();

        productService.getAllTruckRoutes({"username": userData.user.username}).then(data => {
            console.log(data.routes);
            setMyRoutes(data.routes);
        });

    }, []);

    return (
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <h5>Your Load Details:</h5>
                    <DataTable value={myRoutes} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" responsiveLayout="scroll" emptyMessage="No customers found.">
                        <Column field="originName" header="Pickup" style={{ minWidth: '10rem' }} />
                        <Column field="destinationName" header="Drop" style={{ minWidth: '10rem' }} />
                        <Column field="productType" header="Product Type" style={{ minWidth: '10rem' }} />
                        <Column field="date" header="Date" style={{ minWidth: '8rem' }} />
                        <Column field="volumeRequired" header="Weight (in tons)" style={{ minWidth: '10rem' }} />
                        <Column field="truckType" header="Type of Truck" style={{ minWidth: '10rem' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    )

}