import axios from 'axios';

const allRoutesUrl = 'http://localhost:3001/api/route/getalltruckroutes';

const myRoutes = 'http://localhost:3001/api/route/getmytruckroutes';

export class ProductService {

    getProductsSmall() {
        return axios.get('assets/demo/data/products-small.json').then(res => res.data.data);
    }

    getProducts() {
        return axios.get('assets/demo/data/products.json').then(res => res.data.data);
    }

    getAllTruckRoutes() {
        return axios.get(allRoutesUrl)
            .then(res => res.data);
    }

    getMyTruckRoutes(routeData) {
        return axios.post(myRoutes, {
            routeData: routeData
        }).then(res => res.data);
        
    }
}