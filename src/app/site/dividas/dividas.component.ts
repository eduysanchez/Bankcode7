import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { DividaModel } from '../../models/divida.model';
import { DividasService } from '../../services/dividas.service';
import { ClienteService } from '../../services/cliente.service';
import { ClienteModel } from '../../models/cliente.model';

@Component({
  selector: 'app-dividas',
  templateUrl: './dividas.component.html',
  styleUrls: ['./dividas.component.css']
})
export class DividasComponent implements OnInit {
  dividaForm!: FormGroup;
  divida = new DividaModel();
  getDividas: DividaModel[] = [];
  title: string = '';
  text: string = '';
  clientes: ClienteModel[] = [];
  newDivida: ClienteModel[] = [];

  constructor(
    private dividaService: DividasService,
    private clientService: ClienteService
  ) { 

    this.clientService.getClient()
    .subscribe((resp: any) => {
      this.clientes = resp;
    });

  }

  ngOnInit(): void {

    if (this.clientes) {

      // Get Dividas List
      this.dividaService.getdebts()
      .subscribe( (resp: any) => {

        this.getDividas = resp;

        this.clientes.forEach(cliente => {

          for (let i = 0; i < this.getDividas.length; i++) {
  
            if (Number(this.getDividas[i].id_user) === cliente.id) {
              this.getDividas[i].cliente = cliente.name;
            }
            
          }
          
        });

      });
      
    }
  }

  // Register Form
  dividas(dividaForm: NgForm){

    if(dividaForm.invalid){ return;}

    Swal.fire({
      title: 'Espere, por favor...',
      text: 'Salvando informações',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let requests: Observable<any>;


    if(this.divida.id){
      requests = this.dividaService.updatedebt(this.divida);
      
      this.title = 'Cliente atualizado';
      this.text = 'Atualizado com sucesso';

    } else {
      requests = this.dividaService.createdebt(this.divida);
      
      this.title = 'Cliente Adicionado';
      this.text = 'Foi salvo com sucesso';

    }

    requests.subscribe((resp: any) => {

      let pushResp = resp;

      let newClient: Observable<any>;

      newClient = this.clientService.getClientJson(Number(resp.id_user));

      newClient.subscribe((respnewClient: any) => {
        pushResp.cliente = respnewClient.name;
      });
      
      this.getDividas.push(pushResp);

      Swal.fire({
        title: this.title,
        text: this.text,
        icon: 'success'
      });
    });
    
  }

  // Edit divida
  iditDivida(id: string){
    this.dividaService.getdebt(id)
    .subscribe( (resp: any) => {
      this.divida = resp;
      this.divida.id = id;
    })
  }

  // Delete Divida
  deleteDivida(id: string, name: string, index: number){    

    Swal.fire({
      title: 'Tem certeza?',
      text: `Você não será capaz de se recuperar os dados de ${ name }`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Exclua!'
    }).then((result) => {
      if (result.value) {
        this.getDividas.splice(index, 1);
        this.dividaService.deleteDebt(id).subscribe();
        Swal.fire(
          'Dados Excluído!',
          'Seu arquivo foi excluído.',
          'success'
        )
      }
    });

  }



}
