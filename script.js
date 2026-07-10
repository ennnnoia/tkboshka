document.addEventListener('DOMContentLoaded', function() {
    const mapElement = document.getElementById('map');
    const wrapper = document.getElementById('map-wrapper');

    if (typeof Panzoom === 'undefined') {
        console.error('❌ Библиотека Panzoom не загружена!');
        return;
    }

    console.log('✅ Panzoom загружен!');

    // ===== ИНИЦИАЛИЗАЦИЯ PANZOOM =====
    const panzoom = Panzoom(mapElement, {
        maxScale: 2.5,
        minScale: 0.2,
        step: 0.1,
        duration: 300
    });

    wrapper.addEventListener('wheel', panzoom.zoomWithWheel);

    // ===== ФИКСИРОВАННЫЕ КООРДИНАТЫ ДОМИКОВ (27 штук) =====
    // Карта 3000x2000, домики 300x300
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

    // ===== СПИСОК ИЗОБРАЖЕНИЙ (27 штук) =====
    const houseImages = Array.from({ length: 27 }, (_, i) => `images/house-${i + 1}.png`);

    // ===== ГЕНЕРАЦИЯ ДОМИКОВ ПО ФИКСИРОВАННЫМ КООРДИНАТАМ =====
    housesData.forEach((data, index) => {
        const house = document.createElement('div');
        house.className = 'house';
        
        // Берём координаты из фиксированного массива
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

    // ===== СОЗДАНИЕ ПОПАПА (НОВЫЙ ДИЗАЙН) =====
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

    // ===== ПОЛУЧЕНИЕ ТЕКУЩЕЙ ТРАНСФОРМАЦИИ =====
    function getTransform() {
        const style = window.getComputedStyle(mapElement);
        const transform = style.transform;
        
        if (transform === 'none') {
            return { x: 0, y: 0, scale: 1 };
        }
        
        const matrix = transform.match(/matrix.*\((.+)\)/);
        if (!matrix) {
            return { x: 0, y: 0, scale: 1 };
        }
        
        const values = matrix[1].split(', ').map(Number);
        
        if (values.length === 6) {
            return {
                scale: values[0],
                x: values[4],
                y: values[5]
            };
        }
        
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
        const houseSize = 300;
        const offset = 20; // Отступ 20px справа от домика
        
        // Попап всегда справа от домика, независимо от масштаба
        const popupX = (houseX * scale + offsetX + houseSize * scale + offset);
        const popupY = (houseY * scale + offsetY + houseSize * scale / 2);
        
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
        
        mapElement.style.transform = `matrix(${initialScale}, 0, 0, ${initialScale}, ${tx}, ${ty})`;
        
        if (typeof panzoom.setTransform === 'function') {
            panzoom.setTransform({ x: tx, y: ty, scale: initialScale });
        }
    }

    // Обновляем позицию попапа при зуме/перемещении
    function updatePopupPosition() {
        if (popup.style.display === 'block') {
            const activeHouse = document.querySelector('.house.active');
            if (activeHouse) {
                showPopup(activeHouse);
            }
        }
    }

    mapElement.addEventListener('panzoomchange', updatePopupPosition);
    window.addEventListener('resize', function() {
        fitMap();
        setTimeout(updatePopupPosition, 100);
    });

    window.addEventListener('load', function() {
        setTimeout(fitMap, 500);
    });

    console.log('✅ Карта готова к работе!');
});
