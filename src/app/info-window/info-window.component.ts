import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-window',
  standalone: true,
  template: `
    <div class="info-window">
      <h4>{{ title }}</h4>
      <p>{{ description }}</p>
      <button (click)="action()">Ação</button>
    </div>
  `,
  styleUrls: ['./info-window.component.scss']
})
export class InfoWindowComponent {
  @Input() title: string = '';
  @Input() description: string = '';

  action() {
    // Defina a ação que o botão deverá realizar
    console.log('Ação do info window acionada!');
  }
}
