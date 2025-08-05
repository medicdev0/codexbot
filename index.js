const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// Basit web sunucusu
app.get('/', (req, res) => {
  res.send('Bot aktif!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Sunucu çalışıyor');
});

// Bot ayarları
const options = {
  host: 'codexsmp.aternos.me',
  port: 25565,
  username: 'CodexSMP',
  version: '1.21.4' // 🔥 En önemli kısım: doğru sürüm
};

let bot;

function createBot() {
  bot = mineflayer.createBot(options);

  bot.once('spawn', () => {
    console.log('Bot sunucuya bağlandı.');

    // Eğer sunucu AuthMe veya benzeri bir /login komutu istiyorsa
    bot.chat('/login medicdev8123@');

    // Zıplama döngüsü
    setTimeout(() => {
      bot.jumpInterval = setInterval(() => {
        bot.setControlState('jump', true);
        setTimeout(() => {
          bot.setControlState('jump', false);
        }, 500);
      }, 2000);
    }, 3000);
  });

  bot.on('end', () => {
    console.log('Bağlantı koptu, yeniden bağlanılıyor...');
    clearInterval(bot.jumpInterval);
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('Hata:', err);
  });

  // Chat mesajlarını güvenli bir şekilde logla
  bot.on('message', (jsonMsg) => {
    try {
      console.log("Sohbet:", jsonMsg.toString());
    } catch (e) {
      console.log("Sohbet (JSON):", JSON.stringify(jsonMsg));
    }
  });
}

createBot();
