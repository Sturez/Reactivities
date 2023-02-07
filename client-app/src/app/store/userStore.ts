import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";

export default class UserStore {

    user?: User = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    current = async () => {
        try {
            this.user = await agent.Account.current();
        } catch (error) {
            throw error;
        }
    }

    login = async (formValues: UserFormValues) => {
        try {
            const user = await agent.Account.login(formValues);
            console.log(user);
            return user;
        } catch (error) {
            throw error;
        }

    }

    register = async (formValues: UserFormValues) => {
        try {
            this.user = await agent.Account.register(formValues);
            return this.user;
        } catch (error) {
            throw error;
        }
    }
}