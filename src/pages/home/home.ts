import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  markers: any = {};
  headers: any;

  // Url: https://l9ulmcl90j.execute-api.us-west-2.amazonaws.com/RDDTProd/DeviceDropRead
  // APIKEY: 

  constructor(public geolocation: Geolocation, public events: Events, private http: HttpClient) {
    // Add an event listener for adding markers
    this.events.subscribe("marker:add", (marker) => {
      this.markers[marker.ID] = marker;
      marker.setMap(this.map);
    });

    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    //this.http.setHeader('x-api-key', 'G6Gp4nLaENUFkhUkX8V93RCD47jivEq9FzReFlq7');
    
    let temp = this;
    setInterval(() => {
      temp.pollMarkers();
    }, 2000);
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  pollMarkers() {
      // this.http.get('https://l9ulmcl90j.execute-api.us-west-2.amazonaws.com/RDDTProd/DeviceDropRead', {}, {}).then( (data) => {
      //   var responseBody = JSON.parse(data.data);
      //   console.log(responseBody);
      // }).catch(error => {
      //   console.log("Error: " + error);
      // });

    this.http.get('https://r73m4jyev3.execute-api.us-west-2.amazonaws.com/production/DeviceDropRead',
                  this.headers).subscribe(
        (data) => {
          //console.log(data);
          for(var aS in data) {
            let sensor = JSON.parse(aS);
            this.events.publish("sensor:tripped", {
              "id": sensor.id,
            });
          }
        },
        (err) => {
          console.log(err);
        });
  }

  loadMap() {

    this.geolocation.getCurrentPosition().then((position) => {
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
