import { DatePipe } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';
import { NotificationService } from 'src/app/notification.service';
import { Ordreintervention } from 'src/app/ordreintervention.model';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { HeaderTitleService } from 'src/app/services/header-title.service';
import { SessionstorageService } from 'src/app/services/sessionstorage.service';

@Component({
  selector: 'app-ordre-tech',
  templateUrl: './ordre-tech.component.html',
  styleUrls: ['./ordre-tech.component.css']
})
export class OrdreTechComponent implements OnInit {
  Ordreintervention:any=[];
  ordreintervention:any=Ordreintervention;
  etat:any;
  id:any;
  description:any;
  Min:any;
  Max:any;
  page = 1;
  count = 0;
  tableSize = 6;
  tableSizes = [ 6, 9, 12];
  closeModal:any ;
  Etat: any = ['valider','rejetee','initiale']  ;
  form: any = FormGroup;
  submitted = false;
  message="";
  public show_div : boolean = false;
  public button_name : any = 'exception';
  delete:boolean=true;
  constructor(private router: Router,private formBuilder: FormBuilder,private notifyService : NotificationService,private modalService: NgbModal,private headerTitleService: HeaderTitleService,private route: ActivatedRoute,private Serviceapibackend:BackendApiService,private sessionSotragesevice:SessionstorageService) { }

  ngOnInit(): void {
    this.headerTitleService.setTitle('Liste Ordre ');console.log('Liste Ordre')
    this.modalService.dismissAll('done')

   // session this .get (UserId)
   this.id = this.sessionSotragesevice.get('UserId');
   console.log(this.id)
   //alert(this.id)

 this.loadordreintervention();
 this.form = this.formBuilder.group({
 etat:['',Validators.required],
 description:['',Validators.required],
//  demandeintervention:['',Validators.required],
});
console.log(this.form.value)
}
 // convenience getter for easy access to form fields
 get f() {
  return this.form.controls;


}
 loadordreintervention(){
  //if(this.Userrole=="technicien"){
this.Serviceapibackend.getOrdreSelonUserConnected(this.id).subscribe((data:any) => {
  this.Ordreintervention = data;
  console.log('service ordreintervention by user')
  console.log(data);

 });
} 
    // format date in typescript
    getFormatedDate(date: Date, format: string) {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(date, format);
    } 

get sortData() {
  return this.Ordreintervention.sort((a:any, b:any) => new Date(b.debutprevu).getTime() - new Date(a.debutprevu).getTime());
 

  // return this.Ordreintervention.ordreintervention.sort((a:any, b:any) => {
  // return <any>new Date(b.date) - <any>new Date(a.date);
       
  //     });
    }
  
onTableDataChange(event:any){
  this.page = event;
  this.loadordreintervention();
}  

onTableSizeChange(event:any): void {
  this.tableSize = event.target.value;
  this.page = 1;
  this.loadordreintervention();
} 

triggerModalView(content:any,id:any) {
  this.id=id;
  console.log("msggggg")


  // id = this.route.snapshot.paramMap.get('id');
  // this.Serviceapibackend.getAdmin(id).subscribe((data) => {
  //   console.log(data);
  //  id = this.route.snapshot.paramMap.get('id');
  // this.Serviceapibackend.getOrdreintervention(id).subscribe((data: Ordreintervention) => {
  //   console.log(data);
  //   this.ordreintervention = data;  

  this.Serviceapibackend.getOrdreintervention(id).subscribe((data) => {
    this.ordreintervention = data; 
    console.log(data);

   // this.ordreintervention = data.demandeinterventions;
    //data.demandeintervention=data.demandeintervention;

    //  data.equipement=data.equipement;
    //data.technicien=data.technicien;
    // data.intervention=data.intervention;

    console.log('get Ordreintervention by id');

   }) 
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',windowClass : "myCustomModalClass"}).result.then((res) => {
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
showToasterSuccess(){
  this.notifyService.showSuccess("","Lancer une intervention")
}

save() {
  console.log(this.form.value);
  this.submitted = true
  // this.etat= this.route.snapshot.paramMap.get('etat');

  this.form.value.demandeintervention=this.route.snapshot.paramMap.get('id');

  //if (this.form.valid) {
    this.Serviceapibackend.createOrdreintervention(this.form.value).subscribe(res => {
      console.log('ordre intervention created successfully!');
      this.router.navigate(['/list-Ordre'])
    })
}

toggle() {
  this.show_div = !this.show_div;

  // CHANGE THE TEXT OF THE BUTTON.
  if(this.show_div) 
    this.button_name = "exception";
  else
    this.button_name = "exception";    
}
Rejetee(id:string,idordre:string){
    this.Serviceapibackend.Updatestatus(id,idordre,'rejetee',this.form.value.description).subscribe((data:any) => {

      if(data.action){
        data.description=this.form.value.description;
        console.log(this.form.value)
        console.log(data) 
       // alert("rejetee")
        this.modalService.dismissAll('done')
        this.delete=false;
       // alert("no hidden")
      }
    })
    
}

vue(id:string,idordre:string){
  this.Serviceapibackend.UpdateEtat(id,idordre,'bien reçu').subscribe((data:any) => {
  //  alert("bien reçu")
    console.log(data) 
    if(data.action){
      //this.form.value.description=""
      console.log(data)
      this.modalService.dismissAll('done')
      this.delete=true;
      //alert(" hidden")
    }
  })
}
demarer(index : any){
  this.router.navigate(['/create-intervention', index]);
  this.modalService.dismissAll('done')
}
}