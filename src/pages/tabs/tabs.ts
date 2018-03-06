import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ControlPage } from '../control/control';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ControlPage;

  constructor() {

  }
}
