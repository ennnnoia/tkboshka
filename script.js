(function() {
    'use strict';

    // ===== ПОЛУЧАЕМ ЭЛЕМЕНТЫ =====
    const mapElement = document.getElementById('map');
    const wrapper = document.getElementById('map-wrapper');

    // ===== ИНИЦИАЛИЗАЦИЯ PANZOOM =====
    const panzoom = Panzoom(mapElement, {
        maxScale: 2.5,
        minScale: 0.3,
        step: 0.1,
        duration: 300,
        contain: 'outside'
    });

    // Подключаем колесико мыши для зума
    wrapper.addEventListener('wheel', panzoom.zoomWithWheel);

    // ===== ДАННЫЕ О ВЛАДЕЛЬЦАХ ДОМИКОВ =====
    // 28 записей (можно менять имена и поздравления)
    const housesData = [
        { owner: 'Ивановы', congrats: 'С новосельем! 🥂' },
        { owner: 'Петровы', congrats: 'Счастья и уюта! 🏡' },
        { owner: 'Сидоровы', congrats: 'Пусть всегда будет тепло! 🔥' },
        { owner: 'Кузнецовы', congrats: 'С днем рождения! 🎂' },
        { owner: 'Смирновы', congrats: 'Крепкого здоровья! 💪' },
        { owner: 'Поповы', congrats: 'С Рождеством! ✨' },
        { owner: 'Соколовы', congrats: 'Счастливой семьи! ❤️' },
        { owner: 'Лебедевы', congrats: 'Мира и добра! ☮️' },
        { owner: 'Козловы', congrats: 'С Днем Победы! 🌺' },
        { owner: 'Новиковы', congrats: 'С Новым годом! 🎄' },
        { owner: 'Морозовы', congrats: 'Тепла и уюта! ☀️' },
        { owner: 'Волковы', congrats: 'Смелости и силы! 🐺' },
        { owner: 'Соловьёвы', congrats: 'Красоты и гармонии! 🎵' },
        { owner: 'Васильевы', congrats: 'Богатого урожая! 🌾' },
        { owner: 'Зайцевы', congrats: 'Быстрых успехов! 🚀' },
        { owner: 'Павловы', congrats: 'С днем свадьбы! 💍' },
        { owner: 'Семёновы', congrats: 'С юбилеем! 🎉' },
        { owner: 'Голубевы', congrats: 'Мира и спокойствия! 🕊️' },
        { owner: 'Виноградовы', congrats: 'Сладкой жизни! 🍇' },
        { owner: 'Богдановы', congrats: 'С днем ангела! 👼' },
        { owner: 'Воробьёвы', congrats: 'Весеннего настроения! 🌸' },
        { owner: 'Фёдоровы', congrats: 'С православным праздником! ✝️' },
        { owner: 'Михайловы', congrats: 'С днем города! 🏙️' },
        { owner: 'Беляевы', congrats: 'Светлых идей! 💡' },
        { owner: 'Тарасовы', congrats: 'С днем рождения! 🎁' },
        { owner: 'Беловы', congrats: 'Чистого неба! ☁️' },
        { owner: 'Комаровы', congrats: 'Летнего отдыха! 🏖️' },
        { owner: 'Орловы', congrats: 'Свободы и высоты! 🦅' }
    ];

    // ===== ВАРИАНТЫ ИЗОБРАЖЕНИЙ ДОМИКОВ =====
    const houseImages = [
        'images/house-1.png',
        'images/house-2.png',
        'images/house-3.png',
        'images/house-4.png',
        'images/house-5.png'
    ];

    // ===== ГЕНЕРАЦИЯ ДОМИКОВ =====
    function generateHouses() {
        const mapWidth = 2000;
        const mapHeight = 1500;
        const margin = 60; // Отступ от краев
      

        housesData.forEach((data, index) => {
            const house = document.createElement('div');
            house.className = 'house';
          //const fixedPositions = [
   // { x: 150, y: 200 },
    //{ x: 400, y: 350 },
    // ... 28 позиций
];
// И используйте их вместо Math.random()
            
            // Случайные координаты
            const x = margin + Math.random() * (mapWidth - margin * 2 - 80);
            const y = margin + Math.random() * (mapHeight - margin * 2 - 80);
            
            house.style.left = x + 'px';
            house.style.top = y + 'px';
            
            // Случайное изображение домика
            const randomImage = houseImages[Math.floor(Math.random() * houseImages.length)];
            house.style.backgroundImage = `url('${randomImage}')`;
            
            // Сохраняем данные
            house.dataset.owner = data.owner;
            house.dataset.congrats = data.congrats;
            house.dataset.index = index;

            // Клик по домику
            house.addEventListener('click', function(e) {
                e.stopPropagation();
                showPopup(this);
            });

            mapElement.appendChild(house);
        });
    }

    // ===== СОЗДАЕМ ПОПАП =====
    function createPopup() {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.id = 'popup';
        popup.innerHTML = `
            <h3>🏡 Поздравляем!</h3>
            <div class="owner-name" id="popup-owner">Ивановы</div>
            <div class="congrats-text" id="popup-congrats">С новосельем! 🥂</div>
            <button class="close-btn" id="popup-close">Закрыть</button>
        `;
        mapElement.appendChild(popup);
        return popup;
    }

    const popup = createPopup();
    const popupOwner = document.getElementById('popup-owner');
    const popupCongrats = document.getElementById('popup-congrats');
    const closeBtn = document.getElementById('popup-close');

    // ===== ФУНКЦИЯ ПОКАЗА ПОПАПА =====
    function showPopup(houseElement) {
        const owner = houseElement.dataset.owner;
        const congrats = houseElement.dataset.congrats;
        
        // Получаем координаты домика
        const houseX = parseFloat(houseElement.style.left);
        const houseY = parseFloat(houseElement.style.top);
        
        // Учитываем масштаб и панорамирование
        const scale = panzoom.getScale();
        const transform = panzoom.getTransform();
        
        const popupX = (houseX * scale) + transform.x + (80 * scale) / 2; // + половина ширины домика
        const popupY = (houseY * scale) + transform.y - 10;
        
        // Позиционируем попап
        popup.style.left = popupX + 'px';
        popup.style.top = popupY + 'px';
        
        // Заполняем данными
        popupOwner.textContent = owner;
        popupCongrats.textContent = congrats;
        
        popup.style.display = 'block';
        
        // Добавляем класс активного домика
        document.querySelectorAll('.house').forEach(h => h.classList.remove('active'));
        houseElement.classList.add('active');
    }

    // ===== ЗАКРЫТИЕ ПОПАПА =====
    function closePopup() {
        popup.style.display = 'none';
        document.querySelectorAll('.house').forEach(h => h.classList.remove('active'));
    }

    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closePopup();
    });

    // Закрытие по клику на пустое место
    mapElement.addEventListener('click', function(e) {
        if (e.target === mapElement) {
            closePopup();
        }
    });

    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });

    // ===== АДАПТАЦИЯ ПОД РАЗМЕР ЭКРАНА =====
    function fitMap() {
        const wrapperWidth = wrapper.clientWidth;
        const wrapperHeight = wrapper.clientHeight;
        const mapWidth = 2000;
        const mapHeight = 1500;
        
        let scaleX = wrapperWidth / mapWidth;
        let scaleY = wrapperHeight / mapHeight;
        let initialScale = Math.min(scaleX, scaleY) * 0.85;
        
        if (initialScale > 1) initialScale = 1;
        if (initialScale < 0.3) initialScale = 0.3;
        
        const tx = (wrapperWidth - mapWidth * initialScale) / 2;
        const ty = (wrapperHeight - mapHeight * initialScale) / 2;
        
        panzoom.moveTo(tx, ty);
        panzoom.zoomTo(initialScale, { animate: false });
    }

    // ===== ЗАПУСК =====
    generateHouses();
    
    // Ждем загрузки всех изображений
    window.addEventListener('load', function() {
        setTimeout(fitMap, 200);
    });
    
    window.addEventListener('resize', fitMap);

})();
