import UserEntity from "../entities/User.entity";
import DataService from "./DataService";

export default class UserService {
    static loginService = '/user/login';
    static registerService = '/user/signup';
    static usersService = '/user/users';
    static usersByIdService = '/user/users/';
    static userForgotPasswordService = '/user/users/forgotPassword';

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

    static getUsers(payload: any): Promise<any> {
        return DataService.post(this.usersService, payload).then((response: any) => {
            return {
                count: response?.data?.totalCount,
                data: response?.data?.users?.map((item: any) => new UserEntity(item)) || []
            }
        })
    }

    static getUserById(id: any): Promise<any> {
        return DataService.get(this.usersByIdService + id).then((response: any) => {
            let fullUser = {};
            if (response?.data?.user) {
                fullUser = new UserEntity(response?.data?.user)
            }
            return fullUser;
        })
    }

    static saveUserById(id: any, payload: any): Promise<any> {
        return DataService.patch(this.usersByIdService + id, payload).then((response: any) => {
            return response.data;
        })
    }

    static forgotPassword(payload: any): Promise<any> {
        return DataService.post(this.userForgotPasswordService, payload).then((response: any) => {
            return response.data;
        })
    }
}