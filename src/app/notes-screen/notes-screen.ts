import {HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';


interface INota {
  nome: string;
  UserId: string

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
  novaNota: INota = { nome: "", UserId: "meuId" };

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {

    this.notaSelecionada = null!;
      this.notas = [];
       

    }

  async criarNota() {

    const nomeNota = prompt("qual o nome da Nota?")

    if (!nomeNota) {

      alert("criar nome descente")
      return

    }

    const novoChatObj = {

      chatTitle: nomeNota,
      userId: localStorage.getItem("meuId"),

    }

    let novoChatResponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/chats", novoChatObj, {
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("meuToken")
      }

    })) as INota;

      await this.getNotas();


  };

  async getNotas(){

    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/chats",{
      headers:{

        "Authorization": "Bearer " + localStorage.getItem("meuToken")
        

      }

      }))as INota[];

    if (response) {

      console.log("notas", response);

      let userId = localStorage.getItem("meuId");

      response = response.filter(chat => chat.UserId == userId);

      
      this.notas = response as []
    }

      
  }
  async onNoteClick(noteClicado : INota){

    console.log("nota clicada"), noteClicado
    this.notaSelecionada = noteClicado
    //logca para buscar mensagens

    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/messages?chatId=",{
      
    }

    ))

    this.cd.detectChanges();

  }

}


