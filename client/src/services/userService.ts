import DataService from "./DataService";

export default class UserService {
    static loginService = '/user/login';
    static registerService = '/user/signup';

    static loginUser(payload: any): Promise<any> {
        return DataService.post(this.loginService, payload).then((response: any) => {
            return response.data;
        })
    }

    static registerUser(payload: any): Promise<any> {
        return DataService.post(this.registerService, payload).then((response: any) => {
            return response.data;
        })
    }
}