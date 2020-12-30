import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DividaModel } from '../models/divida.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DividasService {

  // Url do banco de dados Realtime Database Firebase que deve ser trocado
  private url = 'https://bankcode7-59dc2-default-rtdb.firebaseio.com';

  constructor(
    private http: HttpClient
  ) { }

  createdebt(divida: DividaModel){
    return this.http.post(`${ this.url }/dividas.json`, divida)
    .pipe(
      map((resp: any) => {
        divida.id = resp.name;
        return divida;
      })
    );
  }
  
  updatedebt(divida: DividaModel){
    const dividaTemp = {
      ...divida
    }

    delete dividaTemp.id;

    return this.http.put(`${this.url}/dividas/${divida.id}.json`, dividaTemp);
  }

  deleteDebt(id: string){
    return this.http.delete(`${this.url}/dividas/${id}.json`);
  }

  getdebt(id: string){
    return this.http.get(`${this.url}/dividas/${id}.json`);
  }

  getdebts(){
    return this.http.get(`${this.url}/dividas.json`)
    .pipe(
      map(this.createArray)
    );
  }

  private createArray(dividasObj: any){
    const dividas: DividaModel[] = [];

    if(dividasObj === null) { return [];}

    Object.keys(dividasObj).forEach(key => {
      const divida: DividaModel = dividasObj[key];

      divida.id = key;
      dividas.push(divida);
    })

    return dividas;
  }

}
