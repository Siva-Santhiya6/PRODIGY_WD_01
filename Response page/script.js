// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Newsletter form validation and feedback
document.getElementById('newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const message = document.getElementById('message');
    if (email) {
        message.textContent = 'Thank you for subscribing! We\'ll send you eco-travel updates soon.';
        message.classList.add('text-green-200');
        document.getElementById('email').value = '';
    } else {
        message.textContent = 'Please enter a valid email address.';
        message.classList.add('text-red-200');
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        document.getElementById('header').classList.add('bg-white', 'shadow-lg');
    } else {
        document.getElementById('header').classList.remove('bg-white', 'shadow-lg');
    }
});