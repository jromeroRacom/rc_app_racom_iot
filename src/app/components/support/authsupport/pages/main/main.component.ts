import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styles: [`
  .space1 {
    width: 20px;
  }
  .space2 {
    width: 400px;
    height: 500px;
    padding: 200px 0;
  }
  .space3 {
    width: 20px;
  }
  `
  ]
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
