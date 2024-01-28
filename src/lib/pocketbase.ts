
import PocketBase, { type AuthModel } from 'pocketbase';
import { writable } from "svelte/store";
import { browser } from '$app/environment'; 
import { goto } from '$app/navigation';

import type { Writable } from "svelte/store";


export const pb = new PocketBase("https://pocketbase.trailassociation.uk/")


export let user: Writable<AuthModel> = writable(pb.authStore.model);


if (browser) {
    user.subscribe((value: AuthModel) => {
        if (value === null) {
            pb.authStore.clear()
            goto("/");
        }
    });
}
