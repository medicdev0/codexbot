const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// Express sunucusu Railway'in konteyneri durdurmaması için
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
  version: '1.21.4'
};

let bot;

function createBot() {
  try {
    bot = mineflayer.createBot(options);

    bot.once('spawn', () => {
      console.log('Bot sunucuya bağlandı.');

      // Giriş komutu (sunucu AuthMe vb. kullanıyorsa)
      bot.chat('/login medicdev8123@');

      // Bot zıplama hareketi yapar
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
      setTimeout(createBot, 5000); // yeniden başlat
    });

    bot.on('error', (err) => {
      if (err.code === 'ECONNRESET') {
        console.log('⚠️ Sunucu bağlantıyı sıfırladı (ECONNRESET).');
      } else {
        console.error('Bot hatası:', err);
      }
    });

    bot.on('message', (jsonMsg) => {
      try {
        console.log("Sohbet:", jsonMsg.toString());
      } catch (e) {
        console.log("Sohbet (JSON):", JSON.stringify(jsonMsg));
      }
    });

  } catch (err) {
    console.error('createBot hatası:', err);
    setTimeout(createBot, 5000); // hata alırsa tekrar dene
  }
}

// Hataların Railway konteynerini durdurmaması için:
process.on('uncaughtException', (err) => {
  console.log('⛔ Yakalanmamış Hata:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('⛔ Yakalanmamış Promise:', reason);
});

// SIGTERM sinyali gelirse Railway'e "hala canlıyım" de
process.on('SIGTERM', () => {
  console.log('SIGTERM alındı ama konteyner devam ediyor.');
});

createBot();
