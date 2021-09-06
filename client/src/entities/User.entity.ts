export default class UserEntity {
    id: string;
    name: string;
    lastName: string;
    email: string;
    isAdmin: boolean;

    constructor(data: any) {
        this.id = data._id;
        this.name = data.name;
        this.lastName = data.lastName;
        this.email = data.email;
        this.isAdmin = data.isAdmin;
    }
}