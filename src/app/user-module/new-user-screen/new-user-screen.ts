import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-user-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './new-user-screen.html',
  styleUrl: './new-user-screen.css'
})
export class NewUserScreen {

  newUserScreen: FormGroup;

  nameErrorMessege: string;
  emailErrorMessege: string;
  passwordErrorMessege: string;
  darkmode: boolean = false;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.newUserScreen = this.fb.group({

      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
      name: ["", [Validators.required]],

    });

    this.nameErrorMessege = "";
    this.emailErrorMessege = "";
    this.passwordErrorMessege = "";

  }

  async onEnterClick() {

    //alert("Botão de login clicado.");
    this.nameErrorMessege = "";
    this.emailErrorMessege = "";
    this.passwordErrorMessege = "";

    console.log("Name", this.nameErrorMessege);
    console.log("Email", this.newUserScreen.value.email);
    console.log("Password", this.newUserScreen.value.password);

    if (this.newUserScreen.value.name == "") {
      this.nameErrorMessege = "O Campo nome é obrigatório"
      return;
    }

    if (this.newUserScreen.value.email == "") {
      this.emailErrorMessege = "O Campo de e-mail é obrigatório."
      return;
    }

    if (this.newUserScreen.value.password == "" ) {
      this.passwordErrorMessege = "O Campo de Senha é obrigatório."
      return;

//    } else if (this.newUserScreen.value.password.length <= 6){
  //    this.passwordErrorMessege = ""
    }


    let response = await fetch("http://senainotes.us-east-1.elasticbeanstalk.com/api/usuario", {
      method: "POST", //ENVIAR,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.newUserScreen.value.name,
        email: this.newUserScreen.value.email,
        password: this.newUserScreen.value.password,
      })
    });

    console.log("STATUS CODE", response.status)

    if (response.status >= 200 && response.status <= 299) {

      let json = await response.json();

      console.log("JSON", json)

      window.location.href = "login-screen"


    } else {
     "Erro inseperado tente novamente mais tarde"

      //alert("Acesso Negado")
    }

    this.cd.detectChanges();
  }
  ligarDesligarDarkMode() {

      this.darkmode = !this.darkmode;

      document.body.classList.toggle("dark-mode", this.darkmode);

      localStorage.setItem("darkmode", this.darkmode.toString());

    }
}

