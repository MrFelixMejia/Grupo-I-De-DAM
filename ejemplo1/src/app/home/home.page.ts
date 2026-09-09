import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Network } from '@capacitor/network';

import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonFooter
} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonFooter,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ]
})
export class HomePage {
  private readonly offlineMovementsKey = 'controla-offline-movements';
  private readonly offlineNoticeKey = 'controla-offline-notice';
  section = 'inicio';
  connected = true;
  notice = '';
  transactions = [
    { title: 'Supermercado La Sirena', date: 'Hoy', amount: '- RD$ 1,250.00', income: false },
    { title: 'Pago recibido - Cliente', date: 'Hoy', amount: '+ RD$ 5,000.00', income: true },
    { title: 'Farmacia Carol', date: 'Ayer', amount: '- RD$ 480.00', income: false },
  ];
  newMovement = { description: '', amount: null as number | null, income: false };

  constructor(private route: ActivatedRoute, private router: Router) {
    this.section = this.route.snapshot.data['section'] ?? 'inicio';
    this.restoreOfflineMovements();
    this.showPendingOfflineNotice();
    this.verificarConexion();
  }

  async verificarConexion() {
    const status = await Network.getStatus();

    this.connected = status.connected;
  }

  saveMovement() {
    if (!this.newMovement.description || !this.newMovement.amount) return;

    const prefix = this.newMovement.income ? '+' : '-';
    const movement = {
      title: this.newMovement.description,
      date: 'Ahora',
      amount: `${prefix} RD$ ${this.newMovement.amount.toFixed(2)}`,
      income: this.newMovement.income,
    };
    this.transactions.unshift(movement);

    if (!this.connected) {
      const offlineMovements = this.getOfflineMovements();
      offlineMovements.unshift(movement);
      localStorage.setItem(this.offlineMovementsKey, JSON.stringify(offlineMovements));
      localStorage.setItem(this.offlineNoticeKey, 'Sin conexion: el movimiento se guardo localmente y se sincronizara cuando vuelvas a estar en linea.');
    }

    this.router.navigateByUrl('/movimientos');
  }

  private restoreOfflineMovements() {
    const offlineMovements = this.getOfflineMovements();
    this.transactions = [...offlineMovements, ...this.transactions];
  }

  private showPendingOfflineNotice() {
    const pendingNotice = localStorage.getItem(this.offlineNoticeKey);
    if (!pendingNotice) return;

    this.notice = pendingNotice;
    localStorage.removeItem(this.offlineNoticeKey);
  }

  private getOfflineMovements() {
    try {
      return JSON.parse(localStorage.getItem(this.offlineMovementsKey) ?? '[]') as typeof this.transactions;
    } catch {
      return [] as typeof this.transactions;
    }
  }
}