import axios from 'axios';

const routeUrl = 'http://localhost:3001/api/route/addroute';

export class RouteService {

    addRoute(routeData) {
        console.log(routeData);
        return axios.post(routeUrl, {
            routeData: routeData
        }).then(res => res.data);
        
    }

}