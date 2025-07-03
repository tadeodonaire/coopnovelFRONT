import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  usNombre: string = '';
  usApellido: string = '';

  constructor(
    private loginService: LoginService,
    private usuarioService: UsuariosService
  ) {}

  ngOnInit(): void {
  const username = this.loginService.getUsername();
  if (username) {
    this.usuarioService.list().subscribe((usuarios) => {
      const usuario = usuarios.find(u => u.username === username);
      if (usuario) {
        this.usNombre = usuario.usNombre;
        this.usApellido = usuario.usApellido;
      }
    });
  }
}

}
