import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // 1. We define the animation styles here so it works instantly
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
  `]
})
export class AppComponent {
  email = signal('');
  submitted = signal(false);
  isLoading = signal(false);

  onSubmit() {
    // 2. Double check validation to prevent empty submissions
    if (!this.email() || this.email().trim() === '') return;

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
    // 3. This matches the ID we will add to the HTML
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}