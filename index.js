const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot aktif!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Sunucu çalışıyor');
});

const options = {
  host: 'codexsmp.aternos.me',
  port: 25565,
  username: 'CodexSMP',
  version: '1.21.4', // Sürüm uyumluluğu kritik!
};

let bot;

function createBot() {
  bot = mineflayer.createBot(options);

  bot.once('spawn', () => {
    console.log('Bot sunucuya bağlandı.');

    // Giriş komutu
    bot.chat('/login medicdev8123@');

    // Gecikmeli AFK hareketi
    setTimeout(() => {
      bot.jumpInterval = setInterval(() => {
        if (bot && bot.entity) {
          bot.setControlState('jump', true);
          setTimeout(() => {
            bot.setControlState('jump', false);
          }, 300);
        }
      }, 10000); // 10 saniyede bir zıpla (daha az şüpheli)
    }, 5000); // Spawn sonrası gecikme
  });

  bot.on('end', () => {
    console.log('Bağlantı koptu, yeniden bağlanılıyor...');
    clearInterval(bot.jumpInterval);
    setTimeout(createBot, 10000); // 10 saniye bekle
  });

  bot.on('error', (err) => {
    console.log('Hata:', err);
  });
}

createBot();
