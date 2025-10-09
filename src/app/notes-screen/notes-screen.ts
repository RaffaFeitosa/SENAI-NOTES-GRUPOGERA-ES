import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';


interface INota {
  titulo: string;
  UserId: string;
  id: "";
  descricao: string;
  tags: string[],
  imagemURL: string,
}

@Component({
  selector: 'app-notes-screen',
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './notes-screen.html',
  styleUrl: './notes-screen.css'
})
export class NotesScreen {

  tituloInput = new FormControl();
  notaSelecionada: INota;
  notas: INota[];
  darkmode: boolean = false;
  novaNota: INota = { titulo: "", UserId: "meuId", id: "", descricao: "", tags: [],imagemURL:"" };

  tagSelecionada: "";

  tagsDisponiveis = [
    "Dev",
    "cooking",
    "Work",
    "home",
  ];
  arquivoImagem: File | null = null;  // mantém o arquivo selecionado
  urlImagem = '';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {

    this.notaSelecionada = null!;
    this.notas = [];
    this.tagSelecionada = "";

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

    let novaNotaResponse = await firstValueFrom(this.http.post("http://senainotes.us-east-1.elasticbeanstalk.com/swagger/api/anotacoes", novoChatObj, {
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("meuToken")
      }

    })) as INota;

    await this.getNotas();


  };

  async getNotas() {

    let response = await firstValueFrom(this.http.get("http://senainotes.us-east-1.elasticbeanstalk.com/swagger-ui/api/anotacoes", {
      headers: {

        "Authorization": "Bearer " + localStorage.getItem("meuId")


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
    this.notaSelecionada.tags = [this.tagSelecionada];
   this.notaSelecionada.imagemURL = this.urlImagem


    let response = await firstValueFrom(this.http.put("http://senainotes.us-east-1.elasticbeanstalk.com/swagger/api/anotacoes/buscarId/anotacoesId" + this.notaSelecionada.id, this.notaSelecionada)) as INota[];

    if (response) {

      console.log("atualizado", response);
      let userId = localStorage.getItem("meuId");
      response = response.filter(tagSelecionada => tagSelecionada.id == userId);
      this.cd.detectChanges();
    }
  }

  async deletarNotaSelecionada() {

    let confirmation = confirm("deseja realmente apagar nota" + this.notaSelecionada.titulo + "?")
    if (!confirmation) {
      return;

    }

    try {
      let deleteResponse = await firstValueFrom(this.http.delete("http://senainotes.us-east-1.elasticbeanstalk.com/swagger/api/anotacoes/anotacoesId" + this.notaSelecionada.id, {
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
    this.cd.detectChanges();
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


  definirImagem(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      alert('Selecione uma imagem.');
      return;
    }

    const file = input.files[0];

    // Validações simples (opcional, mas recomendado)
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    const tamanhoMaxMB = 5;

    if (!tiposPermitidos.includes(file.type)) {
      alert('Tipo inválido. Use JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > tamanhoMaxMB * 1024 * 1024) {
      alert(`Arquivo muito grande (máx. ${tamanhoMaxMB}MB).`);
      return;
    }

    // Libera a URL anterior (evita vazamento de memória)
    if (this.urlImagem) {
      URL.revokeObjectURL(this.urlImagem);
    }

    // Guarda o arquivo e gera a URL local para preview imediato
    this.arquivoImagem = file;
    this.urlImagem = URL.createObjectURL(file);
    this.cd.detectChanges();
  }

}







//FLUXO

//getNotes
//OnNoteclick
//OnNoteSa
