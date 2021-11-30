import { Component, NgZone } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
//import { SailsClient } from 'ngx-sails';
import { SessionstorageService } from './services/sessionstorage.service';
import {SailsClient} from '@aloreljs/ngx-sails';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GMAO';
  showHead: boolean = false;
  daten= "Getting info en cours ..."
  listAction:any=[];


  constructor( private readonly sails: SailsClient,private router: Router,private sessionStorage:SessionstorageService) {}

  ngOnInit() {
    this.sails.io.connect()
    this.sails.on('connect').subscribe((response:any) => {
 
 
  setTimeout(() => {
    this.daten="LoggedIn at : "+new Date().toUTCString()

  }, 3500);

 

  this.sails.get('/notifications/subscribeAdmins').subscribe((data:any)=>{
    console.log("service suscribe")
    console.log(data)
    this.sails.on('administrators').subscribe((response1:any) => {
      this.listAction.push({pers:response1.pers,datex:response1.datex,action:response1.action})
      console.log("new message")
      console.log(response1)
    });


  });

});
  
  }
  public listenForEvent(): void {
    this.sails.on('eventName').subscribe((response:any) => {});
  }
 
  public makeRequest(): void {
    this.sails.get('url').subscribe();
    this.sails.post('url', {foo: 'bar'}).subscribe((response:any) => {});
  }
 
  public emitEventWithoutAResponse(): void {
 
 
   //this.sails.emit('eventName', 'arg1', 'arg2');
    
  }
 
  public emitEventWithAResponse(): void {
    //this.sails.emitAndWait('eventName', 'arg1', 'arg2').subscribe((response:any)  => {})
  }

  // on route change to '/login', set the variable showHead to false
  //   router.events.forEach((event) => {
  //     if (event instanceof NavigationStart) {
  //       if (event['url'] == '/login') {
  //         this.showHead = false;
  //       } else {
  //         // console.log("NU")
  //         this.showHead = true;
  //       }
  //     }
  //   });
 
}
