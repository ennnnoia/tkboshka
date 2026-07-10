document.addEventListener('DOMContentLoaded', function() {
    const mapElement = document.getElementById('map');
    const wrapper = document.getElementById('map-wrapper');

    // ===== ПАРАМЕТРЫ КАРТЫ =====
    const MAP_WIDTH = 3000;
    const MAP_HEIGHT = 2000;
    const HOUSE_SIZE = 300;
    const MIN_SCALE = 0.15;
    const MAX_SCALE = 2.5;

    // ===== СОСТОЯНИЕ =====
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startOffsetX = 0;
    let startOffsetY = 0;

    // ===== ФИКСИРОВАННЫЕ КООРДИНАТЫ ДОМИКОВ (27 штук) =====
    const fixedPositions = [
        { x: 100, y: 100 },
        { x: 450, y: 80 },
        { x: 800, y: 150 },
        { x: 1150, y: 60 },
        { x: 1500, y: 120 },
        { x: 1850, y: 80 },
        { x: 2200, y: 140 },
        { x: 2550, y: 100 },
        { x: 100, y: 450 },
        { x: 400, y: 500 },
        { x: 750, y: 420 },
        { x: 1100, y: 480 },
        { x: 1450, y: 430 },
        { x: 1800, y: 490 },
        { x: 2150, y: 440 },
        { x: 2500, y: 500 },
        { x: 120, y: 850 },
        { x: 480, y: 800 },
        { x: 820, y: 870 },
        { x: 1180, y: 820 },
        { x: 1520, y: 880 },
        { x: 1880, y: 810 },
        { x: 2220, y: 860 },
        { x: 2580, y: 830 },
        { x: 200, y: 1250 },
        { x: 900, y: 1300 },
        { x: 1700, y: 1280 }
    ];

    // ===== ДАННЫЕ О ВЛАДЕЛЬЦАХ =====
    const housesData = [
        { owner: 'Дом Ивановых', congrats: 'Уютное гнездышко с видом на озеро' },
        { owner: 'Дом Петровых', congrats: 'Старинная усадьба с яблоневым садом' },
        { owner: 'Дом Сидоровых', congrats: 'Современный особняк с панорамными окнами' },
        { owner: 'Дом Кузнецовых', congrats: 'Дом у леса с большой террасой' },
        { owner: 'Дом Смирновых', congrats: 'Кирпичный дом с мансардой' },
        { owner: 'Дом Поповых', congrats: 'Двухэтажный коттедж с гаражом' },
        { owner: 'Дом Соколовых', congrats: 'Дом с бассейном и сауной' },
        { owner: 'Дом Лебедевых', congrats: 'Дом у реки с пристанью' },
        { owner: 'Дом Козловых', congrats: 'Охотничий домик в лесу' },
        { owner: 'Дом Новиковых', congrats: 'Дача с большим огородом' },
        { owner: 'Дом Морозовых', congrats: 'Зимний дом с камином' },
        { owner: 'Дом Волковых', congrats: 'Каменный дом с башней' },
        { owner: 'Дом Соловьёвых', congrats: 'Дом с музыкальной гостиной' },
        { owner: 'Дом Васильевых', congrats: 'Фермерский дом с хозяйством' },
        { owner: 'Дом Зайцевых', congrats: 'Сказочный домик с резными ставнями' },
        { owner: 'Дом Павловых', congrats: 'Свадебный дом с беседкой' },
        { owner: 'Дом Семёновых', congrats: 'Дом для большой семьи' },
        { owner: 'Дом Голубевых', congrats: 'Голубой дом с голубятней' },
        { owner: 'Дом Виноградовых', congrats: 'Виноградная усадьба' },
        { owner: 'Дом Богдановых', congrats: 'Дом с часовней во дворе' },
        { owner: 'Дом Воробьёвых', congrats: 'Весенний дом в цветах' },
        { owner: 'Дом Фёдоровых', congrats: 'Православный дом с иконами' },
        { owner: 'Дом Михайловых', congrats: 'Городской особняк в центре' },
        { owner: 'Дом Беляевых', congrats: 'Светлый дом с большими окнами' },
        { owner: 'Дом Тарасовых', congrats: 'Дом с баней и прудом' },
        { owner: 'Дом Беловых', congrats: 'Белый дом с красной крышей' },
        { owner: 'Дом Орловых', congrats: 'Дом-замок на холме' }
    ];

    const houseImages = Array.from({ length: 27 }, (_, i) => `images/house-${i + 1}.png`);

    // ===== ГЕНЕРАЦИЯ ДОМИКОВ =====
    housesData.forEach((data, index) => {
        const house = document.createElement('div');
        house.className = 'house';
        
        const pos = fixedPositions[index] || { x: 100 + index * 50, y: 100 + index * 30 };
        
        house.style.left = pos.x + 'px';
        house.style.top = pos.y + 'px';
        house.style.backgroundImage = `url('${houseImages[index]}')`;
        
        house.dataset.owner = data.owner;
        house.dataset.congrats = data.congrats;
        house.dataset.x = pos.x;
        house.dataset.y = pos.y;
        
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
        <button class="popup-close" id="popup-close">✕</button>
        <div class="popup-title" id="popup-owner">Название дома</div>
        <div class="popup-desc" id="popup-congrats">Описание дома</div>
    `;
    mapElement.appendChild(popup);

    const popupOwner = document.getElementById('popup-owner');
    const popupCongrats = document.getElementById('popup-congrats');
    const closeBtn = document.getElementById('popup-close');

    // ===== ФУНКЦИЯ ПРИМЕНЕНИЯ ТРАНСФОРМАЦИИ =====
    function applyTransform() {
        mapElement.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${offsetX}, ${offsetY})`;
    }

    // ===== ПРОВЕРКА И ОГРАНИЧЕНИЕ ГРАНИЦ =====
    function clampBounds() {
        const wrapperWidth = wrapper.clientWidth;
        const wrapperHeight = wrapper.clientHeight;
        
        const scaledWidth = MAP_WIDTH * scale;
        const scaledHeight = MAP_HEIGHT * scale;
        
        const minX = wrapperWidth - scaledWidth;
        const minY = wrapperHeight - scaledHeight;
        const maxX = 0;
        const maxY = 0;
        
        if (offsetX > maxX) offsetX = maxX;
        if (offsetX < minX) offsetX = minX;
        if (offsetY > maxY) offsetY = maxY;
        if (offsetY < minY) offsetY = minY;
        
        applyTransform();
    }

    // ===== ЦЕНТРИРОВАНИЕ КАРТЫ (МГНОВЕННО) =====
    function fitMap() {
        const wrapperWidth = wrapper.clientWidth;
        const wrapperHeight = wrapper.clientHeight;
        
        const scaleX = wrapperWidth / MAP_WIDTH;
        const scaleY = wrapperHeight / MAP_HEIGHT;
        let newScale = Math.min(scaleX, scaleY) * 0.85;
        
        if (newScale > 1) newScale = 1;
        if (newScale < MIN_SCALE) newScale = MIN_SCALE;
        
        scale = newScale;
        offsetX = (wrapperWidth - MAP_WIDTH * scale) / 2;
        offsetY = (wrapperHeight - MAP_HEIGHT * scale) / 2;
        
        applyTransform();
    }

    // ===== ОБРАБОТЧИКИ МЫШИ =====
    wrapper.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startOffsetX = offsetX;
        startOffsetY = offsetY;
        wrapper.style.cursor = 'grabbing';
        e.preventDefault();
    });

    window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        offsetX = startOffsetX + dx;
        offsetY = startOffsetY + dy;
        
        clampBounds();
        updatePopupPosition();
    });

    window.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            wrapper.style.cursor = 'grab';
        }
    });

    // ===== ЗУМ КОЛЕСИКОМ =====
    wrapper.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -0.08 : 0.08;
        const newScale = Math.min(Math.max(scale + delta, MIN_SCALE), MAX_SCALE);
        
        if (newScale === scale) return;
        
        const rect = wrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const mapX = (mouseX - offsetX) / scale;
        const mapY = (mouseY - offsetY) / scale;
        
        scale = newScale;
        offsetX = mouseX - mapX * scale;
        offsetY = mouseY - mapY * scale;
        
        clampBounds();
        updatePopupPosition();
    }, { passive: false });

    // ===== ЗУМ КНОПКАМИ + и - =====
    document.addEventListener('keydown', function(e) {
        if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            const newScale = Math.min(scale + 0.1, MAX_SCALE);
            if (newScale !== scale) {
                const centerX = wrapper.clientWidth / 2;
                const centerY = wrapper.clientHeight / 2;
                const mapX = (centerX - offsetX) / scale;
                const mapY = (centerY - offsetY) / scale;
                scale = newScale;
                offsetX = centerX - mapX * scale;
                offsetY = centerY - mapY * scale;
                clampBounds();
                updatePopupPosition();
            }
        } else if (e.key === '-' || e.key === '_') {
            e.preventDefault();
            const newScale = Math.max(scale - 0.1, MIN_SCALE);
            if (newScale !== scale) {
                const centerX = wrapper.clientWidth / 2;
                const centerY = wrapper.clientHeight / 2;
                const mapX = (centerX - offsetX) / scale;
                const mapY = (centerY - offsetY) / scale;
                scale = newScale;
                offsetX = centerX - mapX * scale;
                offsetY = centerY - mapY * scale;
                clampBounds();
                updatePopupPosition();
            }
        }
    });

    // ===== ФУНКЦИЯ ПОКАЗА ПОПАПА =====
    function showPopup(house) {
        const houseX = parseFloat(house.dataset.x);
        const houseY = parseFloat(house.dataset.y);
        const offset = 20;
        
        const popupX = (houseX * scale + offsetX + HOUSE_SIZE * scale + offset);
        const popupY = (houseY * scale + offsetY + HOUSE_SIZE * scale / 2);
        
        popup.style.left = popupX + 'px';
        popup.style.top = popupY + 'px';
        
        popupOwner.textContent = house.dataset.owner;
        popupCongrats.textContent = house.dataset.congrats;
        popup.style.display = 'block';
        
        document.querySelectorAll('.house').forEach(h => h.classList.remove('active'));
        house.classList.add('active');
    }

    // ===== ОБНОВЛЕНИЕ ПОПАПА =====
    function updatePopupPosition() {
        if (popup.style.display === 'block') {
            const activeHouse = document.querySelector('.house.active');
            if (activeHouse) {
                showPopup(activeHouse);
            }
        }
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

    // ===== ОБНОВЛЕНИЕ ПРИ РЕСАЙЗЕ =====
    window.addEventListener('resize', function() {
        fitMap();
        updatePopupPosition();
    });

    // ===== МГНОВЕННЫЙ ЗАПУСК (БЕЗ ЗАДЕРЖЕК) =====
    // Сразу центрируем карту
    fitMap();

    console.log('✅ Карта готова к работе!');
});
