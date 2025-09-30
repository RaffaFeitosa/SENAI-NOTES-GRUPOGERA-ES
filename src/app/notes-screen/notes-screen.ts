import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';

interface INota{
  nome :  string

}

@Component({
  selector: 'app-notes-screen',
  imports: [],
  templateUrl: './notes-screen.html',
  styleUrl: './notes-screen.css'
})
export class NotesScreen {

  novaNota: INota = {
    nome: ""
  }!;

  async criarNota() {
  
    const nomeNota = prompt("qual o nome da Nota?")
    console.log (nomeNota);

    if(!nomeNota){

      alert("criar nome descente")
      return

    }

    this.novaNota.nome = nomeNota;

  
  };

}


