import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  email = signal('');
  submitted = signal(false);
  isLoading = signal(false);

onSubmit() {
  if (!this.email()) return;

  this.isLoading.set(true);

  fetch('https://formspree.io/f/xvzayvvl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      email: this.email()
    })
  })
  .then(async (response) => {
    if (response.ok) {
      this.submitted.set(true);
      this.email.set('');
    } else {
      const errorData = await response.json();
      console.error('Formspree error:', errorData);
    }
  })
  .catch(err => {
    console.error('Network error:', err);
  })
  .finally(() => {
    this.isLoading.set(false);
  });
}

  scrollToWaitlist() {
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}