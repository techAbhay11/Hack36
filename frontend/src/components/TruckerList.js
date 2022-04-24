import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { ProductService } from '../service/ProductService';

export const TruckerList = () => {

    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);

    const [allRoutes, setAllRoutes] = useState(null);


    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];

    useEffect(() => {
        const productService = new ProductService();

        productService.getAllTruckRoutes().then(data => setAllRoutes(data.routes));
    }, []);

    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        }
        else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const dataviewHeader = (
        <div className="grid grid-nogutter">
            <div className="col-6" style={{ textAlign: 'left' }}>
                <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By Price" onChange={onSortChange} />
            </div>
            <div className="col-6" style={{ textAlign: 'right' }}>
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        </div>
    );

    const dataviewListItem = (data) => {
        return (
            <div className="col-12">
                <div className="product-list-item">
                    <img src={`assets/demo/images/truck/${data.truckType}.jpg`} alt={data.truckType} />
                    <div className="product-list-detail">
                        <div className="product-name">{data.username}</div>
                        <div className="product-description">Load: {data.volumeRequired}</div>
                        <i className="pi pi-tag product-category-icon"></i><span className="product-category">{data.truckType}</span>
                    </div>
                    <div className="product-list-action">
                        <span className="product-price">${data.price}</span>
                        <Button icon="pi pi-check" label="Select"></Button>
                    </div>
                </div>
            </div>
        );
    };

    const dataviewGridItem = (data) => {
        return (
            <div className="col-12 md:col-4">
                <div className="card m-3 border-1 surface-border">
                    <div className="flex align-items-center justify-content-between">
                        <div className="flex align-items-center">
                            <i className="pi pi-car mr-2"/>
                            <span className="font-semibold">{data.truckType}</span>
                        </div>
                        <span className={`product-badge status-${data.productType.toLowerCase()}`}>{data.productType}</span>
                    </div>
                    <div className="text-center">
                        <img src={`assets/demo/images/truck/${data.truckType}.jpg`} alt={data.truckType}  className="w-9 shadow-2 my-3 mx-0"/>
                        <div className="text-2xl font-bold">{data.username}</div>
                        <div className="text-2xl font-bold">{data.originName} - {data.destinationName}</div>
                        <div className="mb-3">Load: {data.volumeRequired} tons</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">₹{data.distance*100}</span>
                        <div><span className="text-xl font-semibold">{data.date}</span></div>
                        <Button icon="pi pi-check" />
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (data, layout) => {
        if (!data) {
            return;
        }

        if (layout === 'list') {
            return dataviewListItem(data);
        }
        else if (layout === 'grid') {
            return dataviewGridItem(data);
        }
    };

    return (
        <div className="grid list-demo">
            <div className="col-12">
                <div className="card">
                    <h5>Loads Available</h5>
                    <DataView value={allRoutes} layout={layout} paginator rows={9} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataviewHeader}></DataView>
                </div>
            </div>

        </div>
    )
}
