import { Component, output } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Avatar } from 'primeng/avatar';
import { UserProfile } from '../../components/user-profile/user-profile';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [MenubarModule, BadgeModule, ButtonModule, UserProfile],
  templateUrl: './navbar.html',
})
export class Navbar {
  visible: boolean = false;
  items = [
    {
      label: 'Horarios',
      icon: 'pi pi-calendar',
      routerLink: '/dashboard/schedule',
    },
    {
      label: 'Materias',
      icon: 'pi pi-book',
      routerLink: '/dashboard/subjects',
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-user',
      routerLink: '/dashboard/users',
    },
  ];

  onVisible() {
    this.visible = true;
  }
  closeDialog(event: boolean) {
    this.visible = event;
  }
}
