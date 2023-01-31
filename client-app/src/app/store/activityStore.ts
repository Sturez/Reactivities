import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';
export default class ActivityStore {

    activities: Activity[] = [];
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = false;


    constructor() {
        makeAutoObservable(this);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activities.find(a => a.id === id);
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.clearSelectedActivity();
        this.editMode = true;
    }
    closeForm = () => {
        this.editMode = false;
    }

    //#region CRUD operations

    loadingActivities = async () => {
        this.setLoadingInitial(true);

        try {
            const activities = await agent.Activities.list();

            activities.forEach(activity => {
                activity.date = activity.date.split("T")[0];
                this.activities.push(activity);
            });

        } catch (error) {
            console.error(error);

        } finally {
            this.setLoadingInitial(false);
        }

    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activities.push(activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            console.error(error);
            runInAction(() => { this.loading = false; });
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.loading = false;
                this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
                this.selectedActivity = activity;
                this.editMode = false;
            });
        } catch (error) {
            console.error(error);
            runInAction(() => {
                this.loading = false;
            });

        }
    }

    deleteActivity = async (id: string) => {
        try {
            this.loading = true;
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activities = [...this.activities.filter(a => a.id !== id)];
                if (this.selectedActivity?.id === id)
                    this.clearSelectedActivity();
                this.loading = false;
            });
        } catch (error) {
            console.error(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    //#endregion
}