import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { HeaderTitleService } from 'src/app/services/header-title.service';
import { SessionstorageService } from 'src/app/services/sessionstorage.service';

@Component({
  selector: 'app-list-pieces',
  templateUrl: './list-pieces.component.html',
  styleUrls: ['./list-pieces.component.css']
})
export class ListPiecesComponent implements OnInit {
  PiecesRechange:any=[];
  closeModal:any ;
  id:any;
  SearchTerm:any;
  public searchFilter: any = '';
  page = 1;
  count = 0;
  tableSize = 6;
  tableSizes = [ 6, 9, 12];
  Userrole="";
  error=""; 
  delete:boolean=true;
  constructor(private sessionSotragesevice:SessionstorageService,private headerTitleService: HeaderTitleService,private Serviceapibackend: BackendApiService,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.headerTitleService.setTitle(' Piece Rechange');console.log('Piece Rechange')
    this.Userrole = this.sessionSotragesevice.get('UserRole');

    this.loadPiece();
  }
  loadPiece(){
    this.Serviceapibackend.AlPiecesRechange().subscribe((data:any) => {
      this.PiecesRechange = data;
  
      console.log('service loadPiece')
      console.log(this.PiecesRechange)
   
    })
  }
  deletePiece(){
    if(this.PiecesRechange.length==0){
    this.Serviceapibackend.deletePiecerechangeWithFournisseurNoPermitted(this.id).subscribe(data => {
      this.loadPiece();
      this.error ="Voulez-vous vraiment supprimer ces enregistrements ?"
      this.delete=false;
      this.modalService.dismissAll('done')
    })
  }
  else{
    this.Serviceapibackend.deletePiecerechangeWithFournisseurNoPermitted(this.id).subscribe(data => {
      this.loadPiece();
     this.delete=true;
      console.log('this Piece length !== 0')

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
    this.deletePiece();
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

onTableDataChange(event:any){
  this.page = event;
  this.loadPiece();
}  

onTableSizeChange(event:any): void {
  this.tableSize = event.target.value;
  this.page = 1;
  this.loadPiece();
}

}