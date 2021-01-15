import {makeAutoObservable, runInAction} from "mobx";
import { useState } from "react";

export const store = makeAutoObservable({
    markers: null,
    _lastElement: null,
    async getMarkerPosition(ar) {
        try {
            const data = await fetch("http://muhasebe.dusunsoft.com/onmuhasebe/yonetim/api/" + ar + "/")
            const res = await data.json()

            if (!this._lastElement) {
                runInAction(() => {
                    this._lastElement = res[res.length - 1]
                })
            }

            if (this.markers && JSON.stringify(this.markers) !== JSON.stringify(res)) {
                this.setMarkers(res)
            }
            else if(!this.markers) this.setMarkers(res)

        }
        catch (e) {
            console.log(e)
        }
    },
    setMarkers(markers) {
        this.markers = markers
    },

})