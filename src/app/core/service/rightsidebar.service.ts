import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
@Injectable()
export class RightSidebarService {
  private statusService = new BehaviorSubject<boolean>(false);
  currentStatus = this.statusService.asObservable();
  subjectSkin$ = new Subject<string>();

  constructor() {}
  changeMsg(msg: boolean): void {
    this.statusService.next(msg);
  }

  public onSkinChange(): Observable<string>{
    return this.subjectSkin$;
  }

  public setNewSkinChange(skin: string): void{
    this.subjectSkin$.next(skin);
  }

  public deleteSkinChange(): void{
    this.subjectSkin$.complete();
  }
}
