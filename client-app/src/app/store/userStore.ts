import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { router } from "../router/Routes";
import { store } from "./store";

export default class UserStore {

    user: User | null = null;

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
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate('/activities')

        } catch (error) {
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        localStorage.removeItem('jwt');
        this.user = null;
        router.navigate('/');
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