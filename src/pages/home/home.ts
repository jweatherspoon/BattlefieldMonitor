import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement : ElementRef;
  map : any;

  markers = {};

  constructor(public geolocation : Geolocation, public events : Events) {
    // Add an event listener for adding markers
    this.events.subscribe("marker:add", (marker) => {
      this.markers[marker.ID] = marker;
      marker.setMap(this.map);
    });

    // Add an event listener for removing markers
    // this.events.subscribe("marker:remove", (marker) => {
    //   this.markers[marker.ID].setMap(null);
    //   this.markers[marker.ID] = null;
    // });
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {

    this.geolocation.getCurrentPosition().then( (position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 18,
        minZoom: 18,
        maxZoom: 18,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        zoomControl: false
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });
    
  }

}
