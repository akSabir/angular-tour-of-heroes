import { Injectable } from '@angular/core';
import {Observable,of} from 'rxjs';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';



import {Hero} from './hero';
import {HEROES} from './mock-heroes';

import { MessageService } from './message.service';
import { CATCH_ERROR_VAR } from '../../node_modules/@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  getHeroes():Observable<Hero[]>{
    this.messageService.add('HelloService: fetched heroes');
    //return of (HEROES); --  this uses RxJs 'of' function  to return an array of mock heroes as an Observable<Hero[]>
   return this.http.get<Hero[]>(this.heroesUrl)
          .pipe(
            tap(heroes => this.log('feteched heroes')),
            catchError(this.handleError('gerHeroes',[]))
          )

  } 

  constructor(
    private http : HttpClient,
    private messageService:MessageService
  ) {}
   
 getHero(id:Number):Observable<Hero>{
   const url = `${this.heroesUrl}/${id}`;
  //  this.messageService.add(`HeroService Feteched hero id=${id}`);
  //  return of (HEROES.find(hero => hero.id == id));
   
  return this.http.get<Hero>(url)
         .pipe(
           tap(_ => this.log(`Fetched hero id=${id}`)),
           catchError(this.handleError<Hero>(`getHero id=${id}`))
         );

} 

addHero(hero:Hero):Observable<Hero>{
  return this.http.post<Hero>(this.heroesUrl,hero,httpOptions).pipe(
    tap((hero:Hero) => this.log(`added hero w/ id=${hero.id}`)),
    catchError(this.handleError<Hero>('addHero'))
  )
}

updateHero (hero: Hero): Observable<any> {
  return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
    tap(_ => this.log(`updated hero id=${hero.id}`)),
    catchError(this.handleError<any>('updateHero'))
  );
}

deleteHero(hero:Hero):Observable<Hero>{
  const id = typeof hero === 'number' ? hero : hero.id;
  const url = `${this.heroesUrl}/${id}`;
  return this.http.delete<Hero>(url,httpOptions).pipe(
    tap(_ => this.log(`deleted hero id=${id}`)),
    catchError(this.handleError<Hero>('deleteHero'))
  )
}

private log(message:string){
 this.messageService.add(`HeroService : ${message}`);
} 


private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(error);
    this.log(`${operation} failed: ${error.message}`);
    return of(result as T);
  };
}

}
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};