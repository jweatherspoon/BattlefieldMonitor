import { Component } from '@angular/core';

@Component({
    templateUrl: "control.html"
})
export class ControlPage {

    master = new Device("Master");
    slaves = [];

    constructor() {
        for(let i = 1; i <= 6; i++) {
            this.slaves.push(new Device(i));
        }
    }

    resetDevices() {
        this.master.reset();
        for(let slave of this.slaves) {
            slave.reset();
        }
    }
}

class Device {
    ID = null;
    dropped = false;
    activated = "";

    constructor(id) {
        this.ID = id;
    }

    dropOrPickUp() {
        this.dropped = !this.dropped;

        if(this.dropped) {
            // place on the map 
            this.activated = "device-dropped";
        } else {
            // remove from the map 
            this.activated = "";
        }
    }

    reset() {
        this.dropped = false;
        this.activated = "";
    }
}
