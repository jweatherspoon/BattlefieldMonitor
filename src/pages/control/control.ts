import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
    templateUrl: "control.html"
})
export class ControlPage {

    master = null;
    slaves = [];

    constructor(public geolocation : Geolocation, public events : Events) {
        this.master = new Device("Master", this.geolocation, this.events);
        for(let i = 1; i <= 6; i++) {
            this.slaves.push(new Device(i, this.geolocation, this.events));
        }

        // Subscribe to sensor:tripped event
        this.events.subscribe("sensor:tripped", function(eData) {
            if(eData.id == "Master") {
                this.master.trip();
            } else {
                let id = parseInt(eData.id);
                this.slaves[id].trip();
            }
        });
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
    marker = null;

    constructor(id, public geolocation : Geolocation, public events : Events) {
        this.ID = id;
    }

    dropOrPickUp() {
        this.dropped = !this.dropped;

        if(this.dropped) {
            // place on the map 
            this.activated = "device-dropped";

            // Initialize the marker if not already done 
            this.geolocation.getCurrentPosition().then( (pos) => {
                let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                
                this.marker = new google.maps.Marker({
                    position: latLng,
                    label: this.ID.toString()[0]
                });

                // Send an event to add the marker to the map 
                this.events.publish("marker:add", this.marker);

                this.trip();
            });
            

        } else {
            // remove from the map 
            this.activated = "";
            this.removeMarker();
        }
    }

    trip() {
        if(this.marker) {
            this.marker.setAnimation(google.maps.Animation.BOUNCE);
            // Stop bouncing after 15 seconds
            let temp = this;
            setTimeout( () => {
                temp.marker.setAnimation(null);
            }, 15000);
        }
    }

    reset() {
        this.dropped = false;
        this.activated = "";
        this.removeMarker();
    }

    removeMarker() {
        if(this.marker !== null) {
            this.marker.setMap(null);
            this.marker = null;
        }
       
    }
}
