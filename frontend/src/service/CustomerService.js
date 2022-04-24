import axios from 'axios'

const allRoutesUrl = 'http://localhost:3001/api/route/getalltruckroutes';

export class CustomerService {
    getCustomersMedium() {
        return axios.get('assets/demo/data/customers-medium.json')
            .then(res => res.data.data);
    }

    getAllTruckRoutes() {
        return axios.get(allRoutesUrl)
            .then(res => res.data);
    }



    getCustomersLarge() {
        return axios.get('assets/demo/data/customers-large.json')
                .then(res => res.data.data);
    }
    
}