import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';

export const seguridadGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const tokenValido = loginService.verificar();
  if (!tokenValido) {
    alert('Token inválido. Redirigiendo a login.');
    router.navigate(['/login']);
    return false;
  }

  const rolesPermitidos: string[] = route.data['rolesPermitidos'] || [];
  const rolUsuario = loginService.showRole();

  console.log('🎯 RUTA PROTEGIDA:', state.url);
  console.log('✅ Rol del usuario:', rolUsuario);
  console.log('🔒 Roles permitidos:', rolesPermitidos);

  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rolUsuario)) {
    alert('Acceso denegado. Redirigiendo a /acceso-denegado');
    router.navigate(['/acceso-denegado']);
    return false;
  }

  return true;
};
