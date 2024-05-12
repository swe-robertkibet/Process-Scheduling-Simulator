function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('header nav ul li a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScroll(targetId);
        });
    });
});

document.getElementById("contactLink").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "https://robertkibet.com/"; 
});


function redirectToFcfsSimulation() {
    window.location.href = '/first-come-first-served';
}

function redirectToSrtSimulation() {
    window.location.href = '/shortest-remaining-time';
}

function redirectToRrSimulation() {
    window.location.href = '/round-robin';
}

