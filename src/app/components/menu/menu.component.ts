import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-menu',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatSidenavModule,
    CommonModule,
    MatListModule,
    RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  role: string = '';

  @ViewChild('drawer') drawer!: MatSidenav;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  cerrar() {
    sessionStorage.clear();
    sessionStorage.setItem('logoutSuccess', 'true');
    window.location.href = '/inicio';
  }

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }

  isAdministrador() {
    return this.role === 'ADMINISTRADOR';
  }

  isColaborador() {
    return this.role === 'COLABORADOR';
  }

  isLector() {
    return this.role === 'LECTOR';
  }

  isAutor() {
    return this.role === 'AUTOR';
  }

  toggleMenu() {
    // Si quieres mantener un botón de colapsar menú
    // Lo puedes dejar, aunque ahora no colapsa
  }

  navigateAndClose(route: string) {
    this.router.navigate([route]);
    this.drawer.close();
  }
}
