import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Url api autenticar em Firebase
  private url = 'https://identitytoolkit.googleapis.com/v1/accounts';

  // Api key de banco de dados de firebase
  private apiKey = 'AIzaSyCn3DgFp5aYnH23cejNSwMhdwV3MPZ5SxQ';
  userToken!: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    this.readToken();
  }

  // Login
  login(user: User){

    // Assign data that send to Firebase
    const authData = {
      ...user,
      returnSecureToken: true
    };

    // Send data to Firebase
    return this.http.post(
      `${this.url}:signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(
      map( (resp: any) => {
        this.saveToken(resp['idToken'], resp['expiresIn']);
        return resp;
      })
    );

  }

  // Sign Up 
  signUp(user: User){

    // Assign data that send to Firebase
    const authData = {
      ...user,
      returnSecureToken: true
    };

    // Send data to Firebase
    return this.http.post(
      `${this.url}:signUp?key=${this.apiKey}`,
      authData
    ).pipe(
      map( (resp: any) => {
        this.saveToken(resp['idToken'], resp['expiresIn']);
        return resp;
      })
    );

  }

  // Save token and time expire in Local Storage
  private saveToken(idToken: string, expiresIn: number){
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let timeExpire = new Date();
    timeExpire.setSeconds(expiresIn);

    localStorage.setItem('expire', timeExpire.getTime().toString());
  }

  // Read token of local storage
  readToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token')!;
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  // Verify authentication to local storage data
  authenticated(): boolean{
    if(this.userToken.length == undefined){
      return false;
    }

    const expire = Number(localStorage.getItem('expire'));
    const expireDate = new Date();
    expireDate.setTime(expire);

    if(expireDate > new Date()){
      return true;
    } else {
      return false;
    }

    if(this.userToken.length != undefined){
      return true;
    }
  }

  // Logout
  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

}
