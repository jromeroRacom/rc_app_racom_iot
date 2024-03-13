import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-support',
  templateUrl: './footer-support.component.html',
  styleUrls: ['./footer-support.component.scss']
})
export class FooterSupportComponent implements OnInit {

  public mail: string = "mailto:";
  public email: string = "jromero@racom.com.mx";
  public copy: string = "?&bcc=";
  public asunto: string = "&subject=";
  public body: string = "&body=";
  public folio: any = new Date;
  public uuid!: string;

  constructor() { }

  ngOnInit(): void {
  }

  get generarCorreo(): any {
    this.uuid = `xxRxMxxxxxxx`.replace( /[/x/]/g, (c: string) => {
      const r: any = (this.folio + Math.random() * 12) % 12 | 0;
      this.folio = Math.floor(this.folio / 8);
      return (c == 'x' ? r: (r & 0x3 | 0x8)).toString(12);
    });
    return `${this.mail}${this.email}${this.copy}${this.asunto}Asistente%20Virtual%20de%20RACOM.%20FOLIO%20DE%20SEGUIMIENTO:%20${this.uuid}${this.body}%20NOTA:%20Para%20darle%20seguimiento%20a%20su%20solicitud,%20por%20favor%20no%20borre%20el%20NÚMERO%20DE%20FOLIO.`;
  }

}
