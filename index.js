document.addEventListener('DOMContentLoaded', function() {
    const surpriseBtn = document.getElementById('surpriseBtn');
    const surpriseElement = document.getElementById('surprise');
    const birthdaySong = document.getElementById('birthdaySong');
    const confettiContainer = document.querySelector('.confetti-container');
    const bubblesContainer = document.querySelector('.bubbles-container');
    const darkScreen = document.getElementById('darkScreen');
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Variables para fuegos artificiales
    let fireworks = [];
    let particles = [];
    
    // Crear burbujas
    function createBubbles() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.classList.add('bubble');
                
                const size = Math.random() * 30 + 10;
                const posX = Math.random() * window.innerWidth;
                const delay = Math.random() * 5;
                const duration = 5 + Math.random() * 10;
                
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                bubble.style.left = `${posX}px`;
                bubble.style.animationDuration = `${duration}s`;
                bubble.style.animationDelay = `${delay}s`;
                bubble.style.opacity = 0.7 + Math.random() * 0.3;
                
                bubblesContainer.appendChild(bubble);
                
                // Eliminar burbuja después de animación
                setTimeout(() => {
                    bubble.remove();
                }, duration * 1000);
            }, i * 300);
        }
    }
    
    // Clases para fuegos artificiales
    class Firework {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.speed = 2;
            this.angle = Math.atan2(targetY - y, targetX - x);
            this.velocity = {
                x: Math.cos(this.angle) * this.speed,
                y: Math.sin(this.angle) * this.speed
            };
            this.brightness = Math.random() * 50 + 50;
            this.trail = [];
            this.trailLength = 5;
        }
        
        update() {
            this.trail.push({
                x: this.x,
                y: this.y
            });
            
            if (this.trail.length > this.trailLength) {
                this.trail.shift();
            }
            
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            
            const distance = Math.hypot(this.targetX - this.x, this.targetY - this.y);
            
            if (distance < 5) {
                createParticles(this.x, this.y);
                return true;
            }
            return false;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${Math.random() * 60 + 10}, 100%, ${this.brightness}%)`;
            ctx.fill();
            
            for (let i = 0; i < this.trail.length; i++) {
                const point = this.trail[i];
                ctx.beginPath();
                ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${Math.random() * 60 + 10}, 100%, ${this.brightness}%)`;
                ctx.fill();
            }
        }
    }
    
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.velocity = {
                x: (Math.random() - 0.5) * 5,
                y: (Math.random() - 0.5) * 5
            };
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.size = Math.random() * 3 + 1;
        }
        
        update() {
            this.velocity.y += 0.05;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= this.decay;
            return this.alpha > 0;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }
    
    function createParticles(x, y) {
        const particleCount = 100;
        const hue = Math.random() * 60 + 10;
        
        for (let i = 0; i < particleCount; i++) {
            const color = `hsl(${hue}, 100%, 50%)`;
            particles.push(new Particle(x, y, color));
        }
    }
    
    function animateFireworks() {
        requestAnimationFrame(animateFireworks);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            if (fireworks[i].update()) {
                fireworks.splice(i, 1);
            } else {
                fireworks[i].draw();
            }
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].update()) {
                particles[i].draw();
            } else {
                particles.splice(i, 1);
            }
        }
        
        if (Math.random() < 0.03 && fireworks.length < 5) {
            const x = Math.random() * canvas.width;
            const y = canvas.height;
            const targetX = Math.random() * canvas.width;
            const targetY = Math.random() * canvas.height / 2;
            fireworks.push(new Firework(x, y, targetX, targetY));
        }
    }
    
    // Dibujar corazón con animación
    function drawHeart() {
        const heartContainer = document.createElement('div');
        heartContainer.classList.add('heart-drawing');
        
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute('viewBox', '0 0 200 200');
        
        // Crear el path del corazón con más detalle
        const path = document.createElementNS(svgNS, "path");
        path.classList.add('heart-path');
        path.setAttribute('d', 'M100,30 C110,0 160,0 170,30 C180,60 100,90 100,120 C100,90 20,60 30,30 C40,0 90,0 100,30 Z');
        
        svg.appendChild(path);
        heartContainer.appendChild(svg);
        
        // Añadir chispas alrededor del corazón
        const sparklesContainer = document.createElement('div');
        sparklesContainer.classList.add('heart-sparkles');
        
        // Crear múltiples chispas
        for (let i = 0; i < 30; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');
            
            // Posición aleatoria alrededor del corazón
            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 40;
            const x = 100 + Math.cos(angle) * distance;
            const y = 100 + Math.sin(angle) * distance;
            
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            sparkle.style.animationDelay = `${Math.random() * 2}s`;
            sparkle.style.backgroundColor = `hsl(${Math.random() * 60 + 330}, 100%, 70%)`;
            
            sparklesContainer.appendChild(sparkle);
        }
        
        heartContainer.appendChild(sparklesContainer);
        document.body.appendChild(heartContainer);
        
        // Mostrar el corazón después de un breve retraso
        setTimeout(() => {
            heartContainer.style.display = 'block';
            
            // Efecto de brillo final
            setTimeout(() => {
                const glow = document.createElement('div');
                glow.style.position = 'fixed';
                glow.style.top = '50%';
                glow.style.left = '50%';
                glow.style.transform = 'translate(-50%, -50%)';
                glow.style.width = '350px';
                glow.style.height = '350px';
                glow.style.borderRadius = '50%';
                glow.style.background = 'radial-gradient(circle, rgba(255,64,129,0.8) 0%, rgba(255,64,129,0) 70%)';
                glow.style.zIndex = '19';
                glow.style.animation = 'fadeOut 2s forwards';
                
                document.body.appendChild(glow);
                
                // Mostrar mensaje final
                const finalMessage = document.createElement('div');
                finalMessage.classList.add('final-message');
                finalMessage.textContent = 'Te amo con todo mi corazón';
                document.body.appendChild(finalMessage);
                finalMessage.style.display = 'block';
                
                // Eliminar el efecto después de la animación
                setTimeout(() => {
                    glow.remove();
                }, 2000);
            }, 3800);
        }, 500);
        
        // Añadir CSS para el fadeOut
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                to { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Función para crear confeti
    function createConfetti() {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            const posX = Math.random() * window.innerWidth;
            const delay = Math.random() * 5;
            const duration = 3 + Math.random() * 5;
            const size = 5 + Math.random() * 10;
            
            confetti.style.left = `${posX}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.animationDelay = `${delay}s`;
            confetti.style.animationDuration = `${duration}s`;
            
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            } else {
                confetti.style.borderRadius = '0';
            }
            
            confettiContainer.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, duration * 1000);
        }
    }
    
    // Evento para el botón de sorpresa
    surpriseBtn.addEventListener('click', function() {
        // 1. Mostrar la sorpresa inicial
        surpriseElement.classList.remove('hidden');
        surpriseBtn.classList.add('hidden');
        
        // 2. Reproducir música
        birthdaySong.play();
        
        // 3. Crear burbujas
        createBubbles();
        
        // 4. Crear confeti
        createConfetti();
        
        // 5. Después de 3 segundos, oscurecer pantalla
        setTimeout(() => {
            darkScreen.classList.remove('hidden');
            darkScreen.style.opacity = '0.8';
            
            // 6. Detener burbujas y confeti
            document.querySelectorAll('.bubble, .confetti').forEach(el => el.remove());
            
            // 7. Mostrar fuegos artificiales
            canvas.style.display = 'block';
            animateFireworks();
            
            // 8. Dibujar corazón después de 2 segundos más
            setTimeout(drawHeart, 2000);
        }, 3000);
    });
    
    // Efecto de escritura para el nombre
    const nameElement = document.getElementById('name');
    const name = "Mi Amor";
    let i = 0;
    
    function typeWriter() {
        if (i < name.length) {
            nameElement.textContent += name.charAt(i);
            i++;
            setTimeout(typeWriter, 150);
        }
    }
    
    setTimeout(() => {
        nameElement.textContent = '';
        typeWriter();
    }, 1000);
    
    // Ajustar canvas al cambiar tamaño de ventana
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});