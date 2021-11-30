import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Intervention } from 'src/app/intervention.model';
import { NotificationService } from 'src/app/notification.service';
import { Ordreintervention } from 'src/app/ordreintervention.model';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { SessionstorageService } from 'src/app/services/sessionstorage.service';
import { IDropdownSettings,NgMultiSelectDropDownModule
} from 'ng-multiselect-dropdown';
import { PiecesRechange } from 'src/app/pieces-rechange.model';
import * as moment from 'moment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-intervention-create',
  templateUrl: './intervention-create.component.html',
  styleUrls: ['./intervention-create.component.css'],

})
export class InterventionCreateComponent implements OnInit {
  closeModal:any ;
  form: any = FormGroup;
  Usertel:string="";
  Useradresse:string="";
  submitted = false;
  etatin:any ="";
  Technicien: any = [];
  Ordre: any = [];
  Degre:any=['primaire','secondaire '];
  dropdownList:any = [];
  selectedItems:any = [];
  listTemp:any=[];
  Equipement:any=[];
  id:any;
  intervention:any= Intervention;
  Ordreintervention:any=[];
  ordreintervention:any=Ordreintervention;
  Intervention:any=[]
  Userrole:string="";
  idTechnicien:string="";
    minDate :any;
    dropdownSettings:IDropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  //Etat:any=['bien deternimer','Suspendu'];
  public show_div : boolean = false;
  constructor(  private modalService: NgbModal ,private notifyService : NotificationService,private route: ActivatedRoute,private router: Router,private formBuilder: FormBuilder,private sessionSotragesevice:SessionstorageService,private Serviceapibackend: BackendApiService,) { }

  ngOnInit(): void {


    // function  getDataDiff(date_debut:any, debutprevu:any, ) {
    //   var diff = new Date(date_debut).getTime() - new Date(debutprevu).getTime();
    //   var days = Math.floor(diff / (60 * 60 * 24 * 1000));
    //   var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    //   var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    //   var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    //   return { day: days, hour: hours, minute: minutes, second: seconds };
    // }
    // var diff = getDataDiff(new Date(this.intervention.date_debut), new Date(this.ordreintervention.debutprevu));
    // console.log(diff);
  

  this.updateForm();
  this.Serviceapibackend.AlPiecesRechange().subscribe((data: any) => {
  console.log("pieces de rechange   ");
  console.log(data);
  data.forEach((element:any) => {
    this.listTemp.push({item_id:element.id,item_text:element.nom_piece+" | "+element.ref_piece})
  });
  this.dropdownList= this.listTemp;
  console.log(this.dropdownList);
})
    var id = this.route.snapshot.paramMap.get('id');
    this.Serviceapibackend.getOrdreintervention(id).subscribe((data: Ordreintervention) => {
      console.log(data);
      this.ordreintervention = data; 
      //  this.form = this.formBuilder.group({
      //    debutprevu: [data.debutprevu],
      //    dateestimation: [data.dateestimation],
      //  });
       })

    var iso = new Date().toISOString();
   this.minDate = iso.substring(0,iso.length-8);
 
    this.form = this.formBuilder.group({
      date_debut: ['', Validators.required],
      observation: ['', Validators.required],
      //nom_piece: ['', Validators.required],
      //quantite:['',[Validators.required]],

      description: this.formBuilder.array([]),

    },
    );
    this.addTache()
    this.Usertel=this.sessionSotragesevice.get( 'UserTel') ;
    console.log(this.Usertel)
    this.idTechnicien= this.sessionSotragesevice.get('UserId');
  }



  
  // dayDiff(date_debut:Date, debutprevu:Date)
  // {
  //   var diff = Math.abs(new Date(date_debut).getTime() - new Date(debutprevu).getTime());
  //   console.log(diff)
  //   var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
  //   console.log(this.dayDiff(date_debut,debutprevu))
  //   console.log(diffDays)

  //   return diffDays;
  // }
  dayDiff(){
    var date_debut=moment('date_debut');
    var debutprevu=moment('debutprevu');

// calculate total duration
var duration = moment.duration(date_debut.diff(debutprevu));
// duration in days
// moment.duration(date_debut.diff(debutprevu)).asDays();
console.log(duration)
var day=date_debut.diff(debutprevu, 'days') 
// duration in hours
var hours = (duration.asHours());

// duration in minutes
var minutes = (duration.asMinutes())%60;
console.log(hours + ' hour and '+ minutes+' minutes.'+ day+' day ' +duration)
//alert (hours + ' hour and '+ minutes+' minutes.'+ day+' day ' +duration);
  //   var ms =moment.duration(moment(now,"DD/MM/YYYY HH:mm").diff(moment(last,"DD/MM/YYYY HH:mm"))).asHours()
  //  console.log(ms)
  //  var diff =(new Date(this.Intervention.date_debut).getTime() - new Date(this.Ordreintervention.last).getTime()) ;
  //  var hours = Math.floor(diff / (1000 * 60 * 60));
  //  diff -= hours * (1000 * 60 * 60);
  //  var mins = Math.floor(diff / (1000 * 60));
  //  diff -= mins * (1000 * 60);
  }
  onItemSelect(item: any) {
    console.log('eeeeeeeeeee')
    this.selectedItems.push(item.item_id);
    console.log(this.selectedItems)
  }
  onItemDeselect(item:any) {
    console.log(item +" edelete")
      var x= this.selectedItems.filter((itemx:any) => itemx !=item.item_id)
      this.selectedItems=x;
      console.log(  this.selectedItems)
  }
  onSelectAll(items: any) {
    console.log(items);
  }
 // convenience getter for easy access to form fields
 get f() {
  return this.form.controls;


}
/****** Array list tache *******/
description():FormArray{
   return this.form.get("description")as FormArray
 }
addTache() {
   var x= this.form.get('description') as FormArray ;
   x.push(this.formBuilder.group({
     tache:'',
     date:''
   })) 
}
removeTache(index:any) {
  ( this.form.get('description') as FormArray).removeAt(index);
}
Save() {
  if (this.form.valid){
    console.log(this.form.valid);
    this.submitted = true;
    this.form.value.demandein=this.ordreintervention.demandeintervention.id
    this.form.value.ordreintervention=this.route.snapshot.paramMap.get('id');
    this.form.value.equipement=this.ordreintervention.demandeintervention.equipement;
    this.form.value.etat=this.etatin;
     //alert(this.form.value.equipement)
      this.Serviceapibackend.createIntervention(this.form.value).subscribe(res => {
        console.log(' intervention created successfully!');
        console.log(this.form.value)
        this.router.navigate(['/list-intervention'])
        this.notifyService.showSuccess("Intervention  !!","bien crée")
      })
    }
    else{
      console.log(this.form.valid);
      this.notifyService.showDanger("erreur  !!","verifier les champs vide")
    }

 /*  if (this.form.valid){
    this.submitted = true;
    this.form.value.technicien=this.idTechnicien;  

this.form.value.intervention=this.route.snapshot.paramMap.get('id');
    this.Serviceapibackend.createTache(this.form.value).subscribe(res => {
      console.log(' tache created successfully!');
      console.log(this.form.value)
      this.router.navigate(['/list-intervention'])
      this.notifyService.showSuccess("Intervention  !!","bien crée")
    })
  }
  else{
    this.notifyService.showDanger("erreur  !!","verifier les champs vide")
  } */
}
// Choose city using select dropdown
changeEtat(e:any) {
  console.log(e.value)
  this.etat.setValue(e.target.value, {
    onlySelf: true
  })

}
  // Getter method to access formcontrols
get etat(){
  return this.form.get('degre_urgence');
}

changeEat(e: any) {
//  this.form.patchValue({etat: e.target.value});
  console.log("change");
  this.etatin=e.target.value;
  //alert(this.etatin)
  console.log(e.target.value)
} 
toggle() {
this.show_div = !this.show_div;
}
updateForm(){
  this.form = this.formBuilder.group({
    debutprevu: [''],
    dateestimation: [''],
   
   
  })    
}
diff(){
// var debut=new Date(this.debutprevu).getTime();
// var date_debut=new Date(this.date_debut).getTime();
//   this.diff=(this.debut-this.date_debut)/86400000;

}
// calculateDiff() {
//   var date1:any = new Date(this.date_debut);
//   var date2:any = new Date(this.dateestimation);
//   var diffDays:any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));

//   return diffDays;
// }


// UpdatestatusEnattente(idIn:string){   
//   this.Serviceapibackend.UpdatestatusEnattenteObj(idIn,'en attente des pieces').subscribe((data:any) => {
//     if(data.action){
   
//       console.log(data) 
//       this.router.navigate(['/list-intervention'])
    
//     }
//   })
  
// }

submit(){
  console.log(this.form.value);
  if (this.form.valid){
    this.form.value.intervention=this.route.snapshot.paramMap.get('id');

  this.Serviceapibackend.createDemandedePiece(this.form.value).subscribe(res => {
       console.log('demande de pieces created successfully!');
       console.log(this.form.value.intervention)

       //this.router.navigate(['/service']);
       this.notifyService.showSuccess("demande de pieces   !!","bien crée")

      })
    }
      else{
        this.notifyService.showDanger("demande de pieces   !!","verifier les champs vide")
  
  
      }
     
}
triggerModal(content:any,id:any) {
  this.id=id;
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
    this.closeModal = `Closed with: ${res}`;
  }, (res) => {
    this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
  });
}
  obj(id: any, obj: any) {
    throw new Error('Method not implemented.');
  }
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return  `with: ${reason}`;
  }
}
}
