document.addEventListener('DOMContentLoaded', function() {
    const mapElement = document.getElementById('map');
    const wrapper = document.getElementById('map-wrapper');

    // Проверка загрузки библиотеки
    if (typeof Panzoom === 'undefined') {
        console.error('❌ Библиотека Panzoom не загружена! Проверьте подключение.');
        return;
    }

    console.log('✅ Panzoom загружен!');

    // ===== ИНИЦИАЛИЗАЦИЯ PANZOOM =====
    const panzoom = Panzoom(mapElement, {
        maxScale: 2.5,
        minScale: 0.2,
        step: 0.1,
        duration: 300,
        // Отключаем анимацию для плавности
        animate: true
    });

    // Подключаем колесико для зума
    wrapper.addEventListener('wheel', panzoom.zoomWithWheel);

    // ===== ДАННЫЕ О 27 ДОМИКАХ =====
    const housesData = [
        { owner: 'анна чипска', congrats: 'С новосельем! 🥂 Пусть дом будет полной чашей!' },
        { owner: 'ПАПА хаус', congrats: 'Счастья, здоровья и уюта! 🏡' },
        { owner: 'оля кивививи', congrats: 'Пусть всегда горит очаг! 🔥' },
        { owner: 'ярик якорь', congrats: 'Крепкой семьи и верных друзей! 💪' },
        { owner: 'аринини', congrats: 'Мира и добра вашему дому! ☮️' },
        { owner: 'алина фея', congrats: 'С Рождеством! Света и радости! ✨' },
        { owner: 'настя кодзима', congrats: 'Свободы и счастья! 🕊️' },
        { owner: 'воввва', congrats: 'Красоты и гармонии! 🎵' },
        { owner: 'стас маслов сигма', congrats: 'Смелости и удачи во всём! 🐺' },
        { owner: 'анна волонтёркина', congrats: 'С Новым годом! Чудес и подарков! 🎄' },
        { owner: 'вика', congrats: 'Тёплой зимы и уютных вечеров! ☀️' },
        { owner: 'стёпа гхпм', congrats: 'Силы и мудрости! 🐺' },
        { owner: 'катя няшка', congrats: 'Весеннего настроения! 🌸' },
        { owner: 'ника', congrats: 'Богатого урожая и достатка! 🌾' },
        { owner: 'константинополь', congrats: 'Лёгкости и быстрых успехов! 🚀' },
        { owner: 'данёк', congrats: 'С днём свадьбы! Любви до гроба! 💍' },
        { owner: 'кубибоб', congrats: 'С юбилеем! Долгих лет жизни! 🎉' },
        { owner: 'научная башня екатерины', congrats: 'Мира и спокойствия над головой! 🕊️' },
        { owner: 'арсен', congrats: 'Сладкой и богатой жизни! 🍇' },
        { owner: 'олечка мяу', congrats: 'С днём ангела! Божьей помощи! 👼' },
        { owner: 'наталя эльфийская башня', congrats: 'Весны в душе и радости! 🌸' },
        { owner: 'даша ньюююйооорк', congrats: 'С Пасхой! Света и любви! ✝️' },
        { owner: 'егор легенда', congrats: 'С днём города! Гордитесь своим домом! 🏙️' },
        { owner: 'толяяяяян', congrats: 'Светлых идей и вдохновения! 💡' },
        { owner: 'настя байкал толчки', congrats: 'С днём рождения! Всех благ! 🎁' },
        { owner: 'дима мясник', congrats: 'Чистого неба и яркого солнца! ☁️' },
        { owner: 'дарья картошкина', congrats: 'Свободы и новых высот! 🦅' }
    ];

    // ===== СПИСОК ИЗОБРАЖЕНИЙ (27 штук) =====
    const houseImages = Array.from({ length: 27 }, (_, i) => `images/house-${i + 1}.png`);

    // ===== ГЕНЕРАЦИЯ ДОМИКОВ =====
    const mapWidth = 3000;
    const mapHeight = 2000;
    const houseSize = 300;
    const margin = 50;

    housesData.forEach((data, index) => {
        const house = document.createElement('div');
        house.className = 'house';
        
        const x = margin + Math.random() * (mapWidth - margin * 2 - houseSize);
        const y = margin + Math.random() * (mapHeight - margin * 2 - houseSize);
        
        house.style.left = x + 'px';
        house.style.top = y + 'px';
        house.style.backgroundImage = `url('${houseImages[index]}')`;
        
        house.dataset.owner = data.owner;
        house.dataset.congrats = data.congrats;
        house.dataset.x = x;
        house.dataset.y = y;
        
        house.addEventListener('click', function(e) {
            e.stopPropagation();
            showPopup(this);
        });
        
        mapElement.appendChild(house);
    });

    console.log('🏠 Домиков создано:', document.querySelectorAll('.house').length);

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

    // ===== ПОЛУЧЕНИЕ ТЕКУЩЕГО МАСШТАБА И СМЕЩЕНИЯ (ЧЕРЕЗ CSS) =====
    function getTransform() {
        const style = window.getComputedStyle(mapElement);
        const transform = style.transform;
        
        // Если трансформации нет, возвращаем стандартные значения
        if (transform === 'none') {
            return { x: 0, y: 0, scale: 1 };
        }
        
        // Парсим matrix или matrix3d
        const matrix = transform.match(/matrix.*\((.+)\)/);
        if (!matrix) {
            return { x: 0, y: 0, scale: 1 };
        }
        
        const values = matrix[1].split(', ').map(Number);
        
        // matrix(a, b, c, d, e, f)
        // a - масштаб по X, d - масштаб по Y, e - смещение X, f - смещение Y
        if (values.length === 6) {
            return {
                scale: values[0],
                x: values[4],
                y: values[5]
            };
        }
        
        // matrix3d(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
        if (values.length === 16) {
            return {
                scale: values[0],
                x: values[12],
                y: values[13]
            };
        }
        
        return { x: 0, y: 0, scale: 1 };
    }

    // ===== ФУНКЦИЯ ПОКАЗА ПОПАПА =====
    function showPopup(house) {
        const transform = getTransform();
        const scale = transform.scale;
        const offsetX = transform.x;
        const offsetY = transform.y;
        
        const houseX = parseFloat(house.dataset.x);
        const houseY = parseFloat(house.dataset.y);
        
        // Позиция попапа: справа от домика
        const popupX = (houseX * scale + offsetX + 300 * scale + 15);
        const popupY = (houseY * scale + offsetY + 300 * scale / 2);
        
        popup.style.left = popupX + 'px';
        popup.style.top = popupY + 'px';
        
        popupOwner.textContent = house.dataset.owner;
        popupCongrats.textContent = house.dataset.congrats;
        popup.style.display = 'block';
        
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

    mapElement.addEventListener('click', function(e) {
        if (e.target === mapElement) {
            closePopup();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });

    // ===== ЦЕНТРИРОВАНИЕ КАРТЫ (БЕЗ moveTo) =====
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
        
        // Устанавливаем трансформацию напрямую через CSS
        mapElement.style.transform = `matrix(${initialScale}, 0, 0, ${initialScale}, ${tx}, ${ty})`;
        
        // Если у panzoom есть метод setTransform, используем его
        if (typeof panzoom.setTransform === 'function') {
            panzoom.setTransform({ x: tx, y: ty, scale: initialScale });
        }
    }

    // Запуск после загрузки всех изображений
    window.addEventListener('load', function() {
        setTimeout(fitMap, 500);
    });

    window.addEventListener('resize', fitMap);

    // Обновляем позицию попапа при зуме или перемещении
    mapElement.addEventListener('panzoomchange', function() {
        // Если попап открыт, обновляем его позицию
        if (popup.style.display === 'block') {
            const activeHouse = document.querySelector('.house.active');
            if (activeHouse) {
                showPopup(activeHouse);
            }
        }
    });

    console.log('✅ Карта готова к работе!');
});
