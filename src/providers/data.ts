import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataProvider {
  constructor(private afDb: AngularFireDatabase) {}

  push(path: string, data: any): Observable<any> {
    return Observable.create(observer => {
      this.afDb.list(path).push(data).then(firebaseNewData => {
        // Return the uid created
        let newData: any = firebaseNewData;
        observer.next(newData.path.o[newData.path.o.length - 1]);
      }, error => {
        observer.error(error);
      });
    });
  }

  update(path: string, data: any) {
    this.afDb.object(path).update(data);
  }

  list(path: string): Observable<any> {
    return this.afDb.list(path).valueChanges();
  }

  object(path: string): Observable<any> {
    return this.afDb.object(path).valueChanges();
  }

  remove(path: string): Observable<any> {
    return Observable.create(observer => {
      this.afDb.object(path).remove().then(data => {
        observer.next();
      }, error => {
        observer.error(error);
      });
    });
  }
}
