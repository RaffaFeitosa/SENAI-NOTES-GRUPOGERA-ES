import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';


interface INota {
  titulo: string;
  UserId: string;
  id: "";
  descricao: string;
}

@Component({
  selector: 'app-notes-screen',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './notes-screen.html',
  styleUrl: './notes-screen.css'
})
export class NotesScreen {

  tituloInput = new FormControl();
  notaSelecionada: INota;
  notas: INota[];
  novaNota: INota = { titulo: "", UserId: "meuId", id: "", descricao: "" };
  darkmode: boolean = false;

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

      titulo: nomeNota,
      usuarioId: localStorage.getItem("meuId"),
      tags: [],
      descricao: "",
      imagemURL: "",

    }

    let novoChatResponse = await firstValueFrom(this.http.post("http://localhost:3000/notas", novoChatObj, {
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("meuToken")
      }

    })) as INota;

    await this.getNotas();


  };

  async getNotas() {

    let response = await firstValueFrom(this.http.get("http://localhost:3000/notas", {
      headers: {

        "Authorization": "Bearer " + localStorage.getItem("meuToken")


      }

    })) as INota[];

    if (response) {

      console.log("notas", response);

      let userId = localStorage.getItem("meuId");

      // response = response.filter(chat => chat.UserId == userId);


      this.notas = response as []
      this.cd.detectChanges();
    }



  }
  async onNoteClick(noteClicado: INota) {

    console.log("nota clicada"), noteClicado
    this.notaSelecionada = noteClicado
    console.log(this.notaSelecionada)
    this.tituloInput.setValue(this.notaSelecionada.titulo)
    //logca para buscar mensagens

  }

  async onNoteSave() {
    this.notaSelecionada.titulo = this.tituloInput.value;
    let response = await firstValueFrom(this.http.put("http://localhost:3000/notas/" + this.notaSelecionada.id, this.notaSelecionada)) as INota[];

    if (response) {

      console.log("atualizado", response);
      let userId = localStorage.getItem("meuId");
      // response = response.filter(chat => chat.UserId == userId);
      this.cd.detectChanges();
    }
  }

  async deletarNotaSelecionada() {

    let confirmation = confirm("deseja realmente apagar nota" + this.notaSelecionada.titulo + "?")
    if (!confirmation) {
      return;

    }

    try {
      let deleteResponse = await firstValueFrom(this.http.delete("http://localhost:3000/notas/" + this.notaSelecionada.id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("meuToken")
        }
      }
      )) as INota;

    } catch (error) {
      console.log("Erro no delete: " + error);
    }

    this.notaSelecionada = null!;
    this.getNotas();
  }

  async cancelarNota() {
    this.notaSelecionada = null!
    console.log("nenhuma nota selecionada")
  }
  ligarDesligarDarkMode() {

    this.darkmode = !this.darkmode;

    document.body.classList.toggle("dark-mode", this.darkmode);

    localStorage.setItem("darkmode", this.darkmode.toString());

  }
  onClickLogout() {
    localStorage.removeItem("meuToken")
    localStorage.removeItem("meuId")
    
     window.location.href = "login-screen"


  }

}






//FLUXO

//getNotes
//OnNoteclick
//OnNoteSa
