import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';
export default class ActivityStore {

    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = false;


    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values())
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    //#region CRUD operations

    loadingActivities = async () => {
        try {
            this.setLoadingInitial(true);
            const activities = await agent.Activities.list();
            activities.forEach(activity => this.setActivity(activity));
        } catch (error) {
            console.error(error);

        } finally {
            this.setLoadingInitial(false);
        }

    }

    createActivity = async (activity: Activity) => {
        this.setLoadingInitial(true);
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.setLoadingInitial(false);
            });
        } catch (error) {
            console.error(error);
            this.setLoadingInitial(false);
        }
    }

    updateActivity = async (activity: Activity) => {
        this.setLoadingInitial(true);
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.loading = false;
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
            });
        } catch (error) {
            console.error(error);
            this.setLoadingInitial(false);

        }
    }

    deleteActivity = async (id: string) => {
        try {
            this.setLoadingInitial(true);
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            });
        } catch (error) {
            console.error(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        } else {

            try {
                this.setLoadingInitial(true);
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {

                console.error(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split("T")[0];
        this.activityRegistry.set(activity.id, activity);
    }

    //#endregion
}