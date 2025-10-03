import {HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';


interface INota {
  titulo: string;
  UserId: string;
  id : ""


}

@Component({
  selector: 'app-notes-screen',
  imports: [],
  templateUrl: './notes-screen.html',
  styleUrl: './notes-screen.css'
})
export class NotesScreen {

  notaSelecionada: INota;
  notas: INota[];
  novaNota: INota = { titulo: "", UserId: "meuId", id : "" };

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {

    this.notaSelecionada = null!;
      this.notas = [];
       

    }

    ngOnInit() {
      // Executado quando a tela carrega
      this.getNotas();
    }

  async criarNota() {

    const nomeNota = prompt("qual o nome da Nota?")

    if (!nomeNota) {

      alert("criar nome descente")
      return

    }

    const novoChatObj = {

      titulo : nomeNota,
      usuarioId : localStorage.getItem("meuId"),
      tags: [],
      descricao : "",
      imagemURL : "",

    }

    let novoChatResponse = await firstValueFrom(this.http.post("http://localhost:3000/notas", novoChatObj, {
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("meuToken")
      }

    })) as INota;

      await this.getNotas();


  };

  async getNotas(){

    let response = await firstValueFrom(this.http.get("http://localhost:3000/notas",{
      headers:{

        "Authorization": "Bearer " + localStorage.getItem("meuToken")
        

      }

      }))as INota[];

    if (response) {

      console.log("notas", response);

      let userId = localStorage.getItem("meuId");

      // response = response.filter(chat => chat.UserId == userId);

      
      this.notas = response as []
      this.cd.detectChanges();
    }


      
  }
  async onNoteClick(noteClicado : INota){

    console.log("nota clicada"), noteClicado
    this.notaSelecionada = noteClicado
    //logca para buscar mensagens

    let response = await firstValueFrom(this.http.get("http://localhost:3000/notas?notaId=" + this.notaSelecionada.UserId,{

      
    }

    ))

    this.cd.detectChanges();

  }

}





//FLUXO

//getNotes
//OnNoteclick
//OnNoteSave