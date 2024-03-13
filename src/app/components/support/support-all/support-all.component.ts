import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SupportService } from '../support.service';
import { CuestionsAll } from '../interfaces/cuestionsAll';
@Component({
  selector: 'app-support-all',
  templateUrl: './support-all.component.html',
  styleUrls: ['./support-all.component.scss']
})
export class SupportAllComponent implements OnInit {


  public mail: string = "mailto:";
  public email: string = "jromero@racom.com.mx";
  public copy: string = "?&bcc=";
  public asunto: string = "&subject=";
  public body: string = "&body=";
  public folio: any = new Date;
  public uuid!: string;
  public termino: any = '';                             //consulta del input
  public cuestions: CuestionsAll[] = [];                //arreglo a mostrar en mat-option
  public cuestionSelec: CuestionsAll | undefined;      //cuestion seleccionada

  constructor(
    private supportService: SupportService              //Servicio Api
  ) { }

  ngOnInit(): void {
    document.getElementById('bot')?.closest
  }

  search(){
    this.supportService.getSugerencias(this.termino.trim())     //Busqueda del termnino
    .subscribe(cuestions =>
      this.cuestions = cuestions.splice(0,3))
  }

  selecCuestion(event: MatAutocompleteSelectedEvent){     //event: tipado
    if (!event.option.value) {
      this.cuestionSelec = undefined;
      return;
    }
    const cuestion: CuestionsAll = event.option.value;    //Obtenemos valor de tipado value
    this.termino = cuestion.pregunta;

    this.supportService.getSupportId( cuestion.id )       //cuestion seleccionada
    .subscribe( cuestion => this.cuestionSelec = cuestion );    //cuestion seleccionada va ser igual a cuestion
  }

  get generarCorreo(): any {
    this.uuid = `xxRxMxxxxxxx`.replace( /[/x/]/g, (c: string) => {
      const r: any = (this.folio + Math.random() * 12) % 12 | 0;
      this.folio = Math.floor(this.folio / 8);
      return (c == 'x' ? r: (r & 0x3 | 0x8)).toString(12);
    });
    return `${this.mail}${this.email}${this.copy}${this.asunto}Asistente%20Virtual%20de%20RACOM.%20FOLIO%20DE%20SEGUIMIENTO:%20
    ${this.uuid}${this.body}%20NOTA:%20Para%20darle%20seguimiento%20a%20su%20solicitud,%20por%20favor%20no%20borre%20el%20NÚMERO%20DE%20FOLIO.`;
  }

}
