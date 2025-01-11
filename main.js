const farm = document.getElementById('farm');
    const waterButton = document.getElementById('water-button');
    const shopButton = document.getElementById('shop-button');
    const upgradeButton = document.getElementById('upgrade-button');
    const shopModal = document.getElementById('shop');
    const upgradeModal = document.getElementById('upgrade');
    const shopItems = document.getElementById('shop-items');
    const upgradeItems = document.getElementById('upgrade-items');
    const moneyDisplay = document.getElementById('money');
    const weatherDisplay = document.getElementById('weather');
    const timeDisplay = document.getElementById('time');
    const plots = [];
    let money = 100;
    let day = 1;
    let weather = '晴天';
    const crops = [
      { name: '小麦', emoji: '🌾', growthTime: 5000, price: 10 },
      { name: '玉米', emoji: '🌽', growthTime: 7000, price: 20 },
      { name: '胡萝卜', emoji: '🥕', growthTime: 3000, price: 5 }
    ];
    const upgrades = [
      { name: '快速生长', cost: 50, effect: '减少生长时间 20%' },
      { name: '更多金钱', cost: 100, effect: '增加作物价值 50%' }
    ];

    for (let i = 0; i < 25; i++) {
      const plot = document.createElement('div');
      plot.classList.add('plot');
      plot.addEventListener('click', () => plantCrop(plot));
      farm.appendChild(plot);
      plots.push(plot);
    }

    waterButton.addEventListener('click', waterAllPlots);
    shopButton.addEventListener('click', () => openModal(shopModal));
    upgradeButton.addEventListener('click', () => openModal(upgradeModal));
    document.querySelectorAll('.close').forEach(close => {
      close.addEventListener('click', () => closeModal(shopModal) || closeModal(upgradeModal));
    });

    function plantCrop(plot) {
      if (!plot.classList.contains('planted')) {
        plot.classList.add('planted');
        plot.crop = crops[0]; // 默认作物
        plot.textContent = plot.crop.emoji;
        plot.growthTime = plot.crop.growthTime;
        plot.timeout = setTimeout(() => harvestCrop(plot), plot.growthTime);
      }
    }

    function harvestCrop(plot) {
      plot.classList.remove('planted');
      plot.textContent = '💰';
      money += plot.crop.price;
      updateMoney();
      setTimeout(() => {
        plot.textContent = '';
      }, 1000);
    }

    function waterAllPlots() {
      plots.forEach(plot => {
        if (plot.classList.contains('planted')) {
          clearTimeout(plot.timeout);
          plot.growthTime = Math.max(1000, plot.growthTime - 1000);
          plot.timeout = setTimeout(() => harvestCrop(plot), plot.growthTime);
        }
      });
    }

    function openModal(modal) {
      modal.style.display = 'block';
      if (modal === shopModal) {
        shopItems.innerHTML = crops.map(crop => `
          <div>
            <span>${crop.emoji} ${crop.name}</span>
            <button onclick="buyCrop('${crop.name}')">购买 (¥${crop.price})</button>
          </div>
        `).join('');
      } else if (modal === upgradeModal) {
        upgradeItems.innerHTML = upgrades.map(upgrade => `
          <div>
            <span>${upgrade.name}</span>
            <button onclick="buyUpgrade('${upgrade.name}')">购买 (¥${upgrade.cost})</button>
          </div>
        `).join('');
      }
    }

    function closeModal(modal) {
      modal.style.display = 'none';
    }

    function buyCrop(cropName) {
      const crop = crops.find(c => c.name === cropName);
      if (money >= crop.price) {
        money -= crop.price;
        updateMoney();
        plots.forEach(plot => {
          if (plot.classList.contains('planted')) {
            plot.crop = crop;
            plot.textContent = crop.emoji;
          }
        });
      }
    }

    function buyUpgrade(upgradeName) {
      const upgrade = upgrades.find(u => u.name === upgradeName);
      if (money >= upgrade.cost) {
        money -= upgrade.cost;
        updateMoney();
        if (upgrade.name === '快速生长') {
          plots.forEach(plot => {
            if (plot.classList.contains('planted')) {
              plot.growthTime *= 0.8;
            }
          });
        } else if (upgrade.name === '更多金钱') {
          crops.forEach(crop => {
            crop.price *= 1.5;
          });
        }
      }
    }

    function updateMoney() {
      moneyDisplay.textContent = money;
    }

    function updateWeather() {
      const weatherTypes = ['晴天', '雨天', '阴天', '暴风雨'];
      weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      weatherDisplay.textContent = weather;
    }

    function updateTime() {
      day++;
      timeDisplay.textContent = `第 ${day} 天`;
    }

    setInterval(() => {
      updateWeather();
      updateTime();
    }, 60000);
