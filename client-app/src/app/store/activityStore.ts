import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
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
            .sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }


    get groupedActivities() {
        //#region  explanation

        /* creates an object like 
        {
         date: 2023-11-11
         avtivities: [
            activity1,
            activity2
         ]
        }
         */
        //#endregion

        return Object.entries(
            this.activitiesByDate.reduce(
                (activities, activity) => {
                    const date = format(activity.date!, 'dd MMM yyyy');
                    //#region explanation
                    // check if exists an entry with key date, 
                    // if it does exists it adds the new activity to the array
                    // else creates a new activities array and assigns it to it
                    //#endregion
                    activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                    return activities;
                }
                , {} as { [key: string]: Activity[] }));

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
            this.setLoadingInitial(false);
        } catch (error) {
            console.error(error);

        } finally {
            this.setLoadingInitial(false);
        }

    }

    createActivity = async (activity: Activity) => {
        this.setLoadingInitial(true);
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
            this.setLoadingInitial(false);
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
        this.setLoadingInitial(true);
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            this.setLoadingInitial(false);
            return activity;
        } else {
            console.log("loadActivity");
            try {
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
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    //#endregion
}