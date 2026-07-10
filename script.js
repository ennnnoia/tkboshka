document.addEventListener('DOMContentLoaded', function() {
    const mapElement = document.getElementById('map');
    const wrapper = document.getElementById('map-wrapper');

    // Проверка загрузки библиотеки
    if (typeof Panzoom === 'undefined') {
        console.error('Библиотека Panzoom не загружена!');
        return;
    }

    // Инициализация panzoom
    const panzoom = Panzoom(mapElement, {
        maxScale: 2.5,
        minScale: 0.2,
        step: 0.1,
        duration: 300
    });

    wrapper.addEventListener('wheel', panzoom.zoomWithWheel);

    // ===== ДАННЫЕ О 27 ДОМИКАХ =====
    const housesData = [
        { owner: 'Ивановы', congrats: 'С новосельем! 🥂 Пусть дом будет полной чашей!' },
        { owner: 'Петровы', congrats: 'Счастья, здоровья и уюта! 🏡' },
        { owner: 'Сидоровы', congrats: 'Пусть всегда горит очаг! 🔥' },
        { owner: 'Кузнецовы', congrats: 'Крепкой семьи и верных друзей! 💪' },
        { owner: 'Смирновы', congrats: 'Мира и добра вашему дому! ☮️' },
        { owner: 'Поповы', congrats: 'С Рождеством! Света и радости! ✨' },
        { owner: 'Соколовы', congrats: 'Свободы и счастья! 🕊️' },
        { owner: 'Лебедевы', congrats: 'Красоты и гармонии! 🎵' },
        { owner: 'Козловы', congrats: 'Смелости и удачи во всём! 🐺' },
        { owner: 'Новиковы', congrats: 'С Новым годом! Чудес и подарков! 🎄' },
        { owner: 'Морозовы', congrats: 'Тёплой зимы и уютных вечеров! ☀️' },
        { owner: 'Волковы', congrats: 'Силы и мудрости! 🐺' },
        { owner: 'Соловьёвы', congrats: 'Весеннего настроения! 🌸' },
        { owner: 'Васильевы', congrats: 'Богатого урожая и достатка! 🌾' },
        { owner: 'Зайцевы', congrats: 'Лёгкости и быстрых успехов! 🚀' },
        { owner: 'Павловы', congrats: 'С днём свадьбы! Любви до гроба! 💍' },
        { owner: 'Семёновы', congrats: 'С юбилеем! Долгих лет жизни! 🎉' },
        { owner: 'Голубевы', congrats: 'Мира и спокойствия над головой! 🕊️' },
        { owner: 'Виноградовы', congrats: 'Сладкой и богатой жизни! 🍇' },
        { owner: 'Богдановы', congrats: 'С днём ангела! Божьей помощи! 👼' },
        { owner: 'Воробьёвы', congrats: 'Весны в душе и радости! 🌸' },
        { owner: 'Фёдоровы', congrats: 'С Пасхой! Света и любви! ✝️' },
        { owner: 'Михайловы', congrats: 'С днём города! Гордитесь своим домом! 🏙️' },
        { owner: 'Беляевы', congrats: 'Светлых идей и вдохновения! 💡' },
        { owner: 'Тарасовы', congrats: 'С днём рождения! Всех благ! 🎁' },
        { owner: 'Беловы', congrats: 'Чистого неба и яркого солнца! ☁️' },
        { owner: 'Орловы', congrats: 'Свободы и новых высот! 🦅' }
    ];

    // ===== 27 УНИКАЛЬНЫХ ИЗОБРАЖЕНИЙ ДОМИКОВ =====
    // Каждый домик получает свою картинку по номеру
    const houseImages = [
        'images/house-1.png',
        'images/house-2.png',
        'images/house-3.png',
        'images/house-4.png',
        'images/house-5.png',
        'images/house-6.png',
        'images/house-7.png',
        'images/house-8.png',
        'images/house-9.png',
        'images/house-10.png',
        'images/house-11.png',
        'images/house-12.png',
        'images/house-13.png',
        'images/house-14.png',
        'images/house-15.png',
        'images/house-16.png',
        'images/house-17.png',
        'images/house-18.png',
        'images/house-19.png',
        'images/house-20.png',
        'images/house-21.png',
        'images/house-22.png',
        'images/house-23.png',
        'images/house-24.png',
        'images/house-25.png',
        'images/house-26.png',
        'images/house-27.png'
    ];

    // ===== ГЕНЕРАЦИЯ ДОМИКОВ =====
    const mapWidth = 3000;
    const mapHeight = 2000;
    const houseSize = 300;
    const margin = 50;

    housesData.forEach((data, index) => {
        const house = document.createElement('div');
        house.className = 'house';
        
        // Генерируем координаты с учётом размера домика
        const x = margin + Math.random() * (mapWidth - margin * 2 - houseSize);
        const y = margin + Math.random() * (mapHeight - margin * 2 - houseSize);
        
        house.style.left = x + 'px';
        house.style.top = y + 'px';
        
        // ===== КАЖДОМУ ДОМИКУ СВОЯ КАРТИНКА ПО НОМЕРУ =====
        house.style.backgroundImage = `url('${houseImages[index]}')`;
        
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

    // ===== СОЗДАНИЕ ПОПАПА =====
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <h3>🏡 Поздравляем!</h3>
        <div class="owner-name" id="popup-owner"></div>
        <div class="congrats-text" id="popup-congrats"></div>
        <button class="close-btn" id="popup-close">Закрыть</button>
    `;
    mapElement.appendChild(popup);

    const popupOwner = document.getElementById('popup-owner');
    const popupCongrats = document.getElementById('popup-congrats');
    const closeBtn = document.getElementById('popup-close');

    // ===== ФУНКЦИЯ ПОКАЗА ПОПАПА =====
    function showPopup(house) {
        const scale = panzoom.getScale();
        const transform = panzoom.getTransform();
        
        // Координаты домика на карте (в пикселях карты)
        const houseX = parseFloat(house.style.left);
        const houseY = parseFloat(house.style.top);
        
        // Позиция попапа: справа от домика
        const popupX = (houseX * scale + transform.x + 300 * scale + 15);
        const popupY = (houseY * scale + transform.y + 300 * scale / 2);
        
        popup.style.left = popupX + 'px';
        popup.style.top = popupY + 'px';
        
        // Заполняем данными
        popupOwner.textContent = house.dataset.owner;
        popupCongrats.textContent = house.dataset.congrats;
        popup.style.display = 'block';
        
        // Убираем активный класс у всех домиков
        document.querySelectorAll('.house').forEach(h => h.classList.remove('active'));
        house.classList.add('active');
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

    // Закрытие по клику на карту (не на домик)
    mapElement.addEventListener('click', function(e) {
        if (e.target === mapElement) {
            closePopup();
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });

    // ===== ЦЕНТРИРОВАНИЕ КАРТЫ =====
    function fitMap() {
        const wrapperWidth = wrapper.clientWidth;
        const wrapperHeight = wrapper.clientHeight;
        const mapWidth = 3000;
        const mapHeight = 2000;
        
        const scaleX = wrapperWidth / mapWidth;
        const scaleY = wrapperHeight / mapHeight;
        let initialScale = Math.min(scaleX, scaleY) * 0.85;
        
        if (initialScale > 1) initialScale = 1;
        if (initialScale < 0.2) initialScale = 0.2;
        
        const tx = (wrapperWidth - mapWidth * initialScale) / 2;
        const ty = (wrapperHeight - mapHeight * initialScale) / 2;
        
        panzoom.moveTo(tx, ty);
        panzoom.zoomTo(initialScale, { animate: false });
    }

    // Запуск после загрузки всех изображений
    window.addEventListener('load', function() {
        setTimeout(fitMap, 300);
    });

    window.addEventListener('resize', fitMap);

    console.log('✅ Карта загружена! Домиков:', document.querySelectorAll('.house').length);
});
