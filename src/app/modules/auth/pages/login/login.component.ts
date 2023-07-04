import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthUser } from 'src/app/@core/models/auth-user';
import { LoginRequest } from 'src/app/@core/models/request/login-request';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isProcessing: boolean = false;

  constructor(
    public layoutService: LayoutService,
    private _authService: AuthService,
    private _messageService: MessageService,
    private _router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  onSubmit(): void {
    this.isProcessing = true;
    const request: LoginRequest = this.loginForm.value;

    this._authService.login(request)
      .then((authUser: AuthUser) => {
        this._messageService.add({ key: 'login', severity: 'success', summary: `Bienvenido ${authUser.username}`, detail: 'Autenticación éxitosa, redireccionando...!' })

        setTimeout(() => {
          const redirectUrl = this._authService.redirectUrl;
          this._router.navigateByUrl(this._router.parseUrl(redirectUrl));
        }, 1500);
      })
      .catch((error) => {
        console.error(error);
        this._messageService.add({ key: 'login', severity: 'error', detail: 'Credenciales Incorrectas.' });
      })
      .finally(() => this.isProcessing = false);
  }
}
