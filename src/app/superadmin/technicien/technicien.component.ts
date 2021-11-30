import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { HeaderTitleService } from 'src/app/services/header-title.service';

@Component({
  selector: 'app-technicien',
  templateUrl: './technicien.component.html',
  styleUrls: ['./technicien.component.css']
})
export class TechnicienComponent implements OnInit {

  Technicien:any=[]
  dtOptions: DataTables.Settings = {};
  closeModal:any ;
  id:any;
  error=""; 
  delete:boolean=true;
 
  constructor( private headerTitleService: HeaderTitleService,private Serviceapibackend: BackendApiService,

    //  private Technicienservice: TechnicienService,
     private modalService: NgbModal) {
   }

  ngOnInit(): void {
    this.headerTitleService.setTitle('Techniciens');console.log('tech')
    this.loadEmployees();
    this.deleteEmployee();

   


  }
  loadEmployees(){//get list users
  
    return this.Serviceapibackend.getTechniciens().subscribe((data: any)=>{
      this.Technicien=data;
      console.log(this.Technicien);
      setTimeout(()=>{                          
        $('#datatableexample').DataTable( {
          pagingType: 'full_numbers',
          pageLength: 5,
          processing: true,
          retrieve: true,
          lengthMenu : [5, 10, 25],
          order:[[1,"desc"]]
      } );
      }, 1);
  
  
    }); 
}
deleteEmployee(){
  if(this.Technicien.length == 0){

    this.Serviceapibackend.DeleteTechnicien(this.id).subscribe(data => {
      this.loadEmployees();
      this.error ="Voulez-vous vraiment supprimer ces enregistrements ?"
      this.delete=false;
      this.modalService.dismissAll('done')


    })
  }
  else{
    this.Serviceapibackend.deletefournisseur(this.id).subscribe(data => {
      this.loadEmployees();
     this.delete=true;
      console.log('this Fournisseur length !== 0')

      this.error ="Vous n'avez pas le droit de supprimer cette enregistrements"
      this.modalService.dismissAll('done')

    })
  }

}
  
triggerModal(content:any,id:any) {
  this.id=id;
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
    this.closeModal = `Closed with: ${res}`;

    this.error="";
    this.deleteEmployee();

  }, (res) => {
    this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    this.error="";
    this.delete=true;
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
