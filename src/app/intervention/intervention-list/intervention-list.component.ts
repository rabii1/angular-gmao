import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Intervention } from 'src/app/intervention.model';
import { Ordreintervention } from 'src/app/ordreintervention.model';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { HeaderTitleService } from 'src/app/services/header-title.service';
import { SessionstorageService } from 'src/app/services/sessionstorage.service';
import { Tache } from 'src/app/tache.model';

@Component({
  selector: 'app-intervention-list',
  templateUrl: './intervention-list.component.html',
  styleUrls: ['./intervention-list.component.css']
})
export class InterventionListComponent implements OnInit {
  Intervention:any=[];
  closeModal:any ;
  id:any;
  Equipement:any=[];
  Ordre:any=[];
  Odreintervention:any=[];
  Userrole="";
  Usertel:string="";

  // Useradresse:string="";
  Userprenom :string="";
  Usernom:string="";
  Useremail:string="";
 intervention:any=Intervention;
 tache:any=Tache;
 Tache:any=[];
 click : boolean = true;
 ordreintervention:any=Ordreintervention;
  constructor(private route: ActivatedRoute,private sessionSotragesevice:SessionstorageService,private headerTitleService: HeaderTitleService,private Serviceapibackend: BackendApiService,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.Userrole = this.sessionSotragesevice.get('UserRole');
    this.id = this.sessionSotragesevice.get('UserId');
    console.log(this.id)

    //this.loadIntervention();
    this.Usertel=this.sessionSotragesevice.get( 'UserTel') ;
    console.log(this.Usertel)
    this.Usernom=this.sessionSotragesevice.get( 'UserPrenom');
    this.Userprenom=this.sessionSotragesevice.get( 'UserNom');
    this.Useremail=this.sessionSotragesevice.get( 'UserEmail');

    
    //this.id = this.sessionSotragesevice.get('UserId');

    this.headerTitleService.setTitle(' Intervention');console.log('Intervention')
    this.loadintervention();
    this.loadEquipement();
    this.Userrole = this.sessionSotragesevice.get('UserRole');
  }

  // loadOrdre(){
  //   this.Serviceapibackend.getOrdreintervention(this.id).subscribe((data: {}) => {
  //     this.Odreintervention = data;
  //     console.log('service ordre')
  //     console.log(data)

  //   }) 
  //   }
  loadEquipement(){
    this.Serviceapibackend.AllEquipement().subscribe((data: {}) => {
      this.Equipement = data;
      console.log('service Equipement')
      console.log(data)
    }) 
    }

  loadintervention(){
    if(this.Userrole=="technicien"){

    this.Serviceapibackend.getAllInterventionWithDetails(this.id).subscribe((data:{})=> {
      this.Intervention = data;
      console.log('service list intervention')
      console.log(data)
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
    
    })}
    else{
      this.Serviceapibackend.getAInterventionWithDetails().subscribe((data:{})=> {
        this.Intervention = data;
        console.log('service list intervention')
        console.log(data)

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
    
  })
}
  }



  deleteIntervention(){
    this.Serviceapibackend.deleteIntervention(this.id).subscribe(data => {
      this.loadintervention()
    })
  
  }
  triggerModalView(content:any,id:any) {
    this.id=id;
    //var id = this.route.snapshot.paramMap.get('id');

    this.Serviceapibackend.GetIntervention(id).subscribe((data:Intervention) => {
      this.intervention = data;
      console.log('get intervention with  deatils ')
      console.log(data)
    })
    // this.Serviceapibackend.getintervention(id).subscribe((data: Intervention) => {
    //   this.intervention = data; 
    //   console.log('get intervention by id');

    //   console.log(data);
    //  })
    //  this.Serviceapibackend.getTacheById(id).subscribe((data: Tache) => {
    //   this.tache = data; 
    //   console.log('get Taches by id');
    //   console.log(data);
    //  }) 
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
  changeEtat(){
    this.click = !this.click;
    this.ordreintervention=this.route.snapshot.paramMap.get('id');

    this.Serviceapibackend.changeEtat(this.id,'suspendue').subscribe((data:any) => {
      console.log(data) 
      if(data.action){
        console.log(data)
        this.modalService.dismissAll('done')
      }
    }) 
  }
  SuspenduAdmin(idDem:string,id:string,idIn:string,equipement:string){
    //this.ordreintervention=this.route.snapshot.paramMap.get('id');
    console.log(this.Intervention)
    alert( idDem +' - '+id+' - '+idIn+' - '+equipement)
    this.Serviceapibackend.ChangeEtatSuspenduAdminWithequip(idDem,id,idIn,'suspenduAdmin',equipement).subscribe((data:any) => {
      //alert("suspenduAdmin")
      console.log(data) 
      if(data.action){
        console.log(data)   
        this.modalService.dismissAll('done') 
      }
    })
  }
  // get sortData() {
  //   return this.Intervention.sort((a:any, b:any) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());
  // }
}
