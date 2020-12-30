import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ClienteModel } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url = 'https://jsonplaceholder.typicode.com/users';

  constructor(
    private http: HttpClient
  ) { }

  // Get all client
  getClient(){
    return this.http.get(`${this.url}`)
    .pipe(
      map(this.createArray)
    );
  }

  // Create array for client
  private createArray(clientesObj: any){
    const clientes: ClienteModel[] = [];

    if(clientesObj === null) { return [];}

    Object.keys(clientesObj).forEach(key => {
      const cliente: ClienteModel = clientesObj[key];

      cliente.id = clientesObj[key]['id'];
      clientes.push(cliente);
    })

    return clientes;
  }

  // Get one client
  getClientJson(id: number){
    return this.http.get(`${this.url}/${id}`);
  }
}
