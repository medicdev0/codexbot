const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Bot aktif!'));
app.listen(3000, () => console.log('Web sunucusu çalışıyor.'));

const options = {
  host: 'codexsmp.aternos.me',
  port: 25565,
  username: 'CodexSMP'
};

let bot;

function createBot() {
  bot = mineflayer.createBot(options);

  bot.once('spawn', () => {
    console.log('Bot sunucuya bağlandı.');
    bot.chat('/login medicdev8123@');
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
}

createBot();
