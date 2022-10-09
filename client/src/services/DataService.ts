import axios from 'axios';

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use((config) => {
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    config.headers['Authorization'] = localStorage.jwtToken;

    return config;
}, function(error) {
    return Promise.reject(error);
});

export const setAuthToken = (token: any) => {
    if(token) {
        axios.defaults.headers.common['Authorization'] = token;
    }
    else {
        delete axios.defaults.headers.common['Authorization'];
    }
}

class DataService {
    static get(url: any, options?: any) {
        return axios
            .get(url, options)
            .catch(this.handlerError)
    }

    static post(url: any, options?: any, moreOptions?: any) {
        return axios
            .post(url, options, moreOptions)
            .catch(this.handlerError)
    }

    static patch(url: any, options?: any) {
        return axios
            .patch(url, options)
            .catch(this.handlerError)
    }

    static put(url: any, options?: any) {
        return axios
            .put(url, options)
            .catch(this.handlerError)
    }

    static delete(url: any, options?: any) {
        return axios
            .delete(url, {data: options})
            .catch(this.handlerError)
    }

    static handlerError(error: any) {
        if (error.response?.data) {
            throw error;
        }
    }
}

export default DataService