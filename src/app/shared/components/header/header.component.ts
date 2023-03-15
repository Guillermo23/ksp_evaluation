import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', './header-mobile.component.scss'],
})
export class HeaderComponent implements OnInit {
  isOpen: boolean = false;
  isCollapsed: boolean = false;


  constructor() {}

  ngOnInit(): void {
    
  }
}

