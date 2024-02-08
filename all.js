const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const totalStars = 1000; // Общее количество звезд
const stars = [];

class Star {
    constructor() {
        this.x = Math.random() * canvas.width; // Случайная позиция X
        this.y = Math.random() * canvas.height; // Случайная позиция Y
        this.brightness = Math.random(); // Задаем начальную яркость (любое значение от 0 до 1)
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`; // Установка цвета звезды на основе яркости
        ctx.fillRect(this.x, this.y, 2, 2); // Рисование звезды
    }
}

function createStars() {
    for (let i = 0; i < totalStars; i++) {
        const star = new Star();
        stars.push(star); // Добавление звезды в массив
    }
}

class Spider {
    constructor(legCount, legLength, radius) {
        this.x = Math.random() * canvas.width; // Случайная позиция X для паучка
        this.y = Math.random() * canvas.height; // Случайная позиция Y для паучка
        this.legs = []; // Массив ножек паучка
        this.legLength = legLength; // Длина ножек паучка
        this.legCount = legCount; // Количество ножек паучка (настраиваемое)
        this.radius = radius; // Радиус поиска ближайших звезд
        this.brightness = 0.1; // Начальная яркость паучка
        this.targetX = this.x; // Целевая позиция X (начально равна текущей)
        this.targetY = this.y; // Целевая позиция Y (начально равна текущей)
        this.speed = 0.02; // Скорость движения к мыши
    }

    draw() {
        // Рисование ножек паучка
        ctx.strokeStyle = 'white'; // Белый цвет для ножек
        ctx.lineWidth = 3;
        ctx.beginPath();

        for (const leg of this.legs) {
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(leg.x, leg.y);
        }
        ctx.stroke();
    }

    findClosestStars() {
        // Найти ближайшие звезды и создать ножки паучка
        this.legs = [];

        const angleStep = (Math.PI * 2) / this.legCount;

        for (let i = 0; i < this.legCount; i++) {
            const angle = angleStep * i;
            const legX = this.x + Math.cos(angle) * this.legLength;
            const legY = this.y + Math.sin(angle) * this.legLength;

            let closestStar = null;
            let closestDistance = this.legLength;

            for (const star of stars) {
                const distance = Math.sqrt(
                    (legX - star.x) ** 2 + (legY - star.y) ** 2
                );
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestStar = star;
                }
            }

            if (closestStar) {
                if (closestStar.brightness < 1) {
                    closestStar.brightness = 1;
                }
                this.legs.push({ x: closestStar.x, y: closestStar.y });
            } else {
                this.legs.push({ x: legX, y: legY });
            }
        }
    }

    update() {
        // Обновление позиции паука с плавным движением к мыши
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            // Интерполяция для плавного движения
            this.x += dx * this.speed;
            this.y += dy * this.speed;
        }
    }

    setTargetPosition(mouseX, mouseY) {
        // Установить новую целевую позицию для движения паука
        this.targetX = mouseX;
        this.targetY = mouseY;
    }
}

const spider = new Spider(8, 50, 150); // Создать паучка с 8 ножками, длиной ножек 150 и радиусом поиска 100

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка холста

    for (const star of stars) {
        star.draw(); // Рисование звезды
    }

    spider.findClosestStars(); // Найти ближайшие звезды и создать ножки паучка
    spider.update(); // Обновить позицию паука с плавным движением
    spider.draw(); // Рисование паучка

    requestAnimationFrame(animate); // Запуск анимации на следующем кадре
}

createStars(); // Создание звезд
animate(); // Запуск анимации

canvas.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    spider.setTargetPosition(mouseX, mouseY); // Установить новую целевую позицию для движения паука
});
