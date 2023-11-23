const TelegramApi = require('node-telegram-bot-api');

const token = '6327113627:AAE8Tb2HR-FZh9Jm79R8GDaman2PYiiKFrs';

const bot = new TelegramApi(token, { polling: true });

const users = {}; // Хранит информацию о текущих пользователях

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Greeting' },
    ]);

    bot.on('message', async msg => {
        console.log(msg)
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6be/bac/6bebac93-1f42-4f06-972d-be9211de33f2/8.webp');
            return bot.sendMessage(chatId, 'Привет, выбери опцию:', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '°C=>°F', callback_data: 'convertToF' },
                            { text: 'Kg=>Lbs', callback_data: 'convertToFeet' },
                            { text: 'Cm=>Inch', callback_data: 'convertToInches' },
                            { text: 'Km=>Miles', callback_data: 'convertToMiles' }
                        ]
                    ]
                }
            });
        }
    });

    bot.on('callback_query', async query => {
        const chatId = query.message.chat.id;

        if (query.data === 'convertToF') {
            users[chatId] = { conversionType: 'temperature' };
            await bot.sendMessage(chatId, 'Введи температуру в градусах Цельсия:');
        } else if (query.data === 'convertToFeet') {
            users[chatId] = { conversionType: 'feet' };
            await bot.sendMessage(chatId, 'Введи массу в килограммах для преобразования в Фунты:');
        } else if (query.data === 'convertToInches') {
            users[chatId] = { conversionType: 'inches' };
            await bot.sendMessage(chatId, 'Введи длину в сантиметрах для преобразования в Дюймы:');
        } else if (query.data === 'convertToMiles') {
            users[chatId] = { conversionType: 'miles' };
            await bot.sendMessage(chatId, 'Введи расстояние в километрах для преобразования в Мили:');
        }
    });

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (!msg.entities || msg.entities[0].type !== 'bot_command') {
            // Assuming the user input is a valid number
            const value = parseFloat(text);

            if (isNaN(value)) {
                return bot.sendMessage(chatId, 'Введите число.');
            }

            if (!isNaN(value)) {
                const user = users[chatId];

                if (user) {
                    if (user.conversionType === 'temperature') {
                        const fahrenheitTemperature = (value * 9 / 5) + 32;
                        return bot.sendMessage(chatId, `Температура в Фаренгейтах: ${fahrenheitTemperature.toFixed(2)}`);
                    } else if (user.conversionType === 'feet') {
                        const feet = value * 2.20462;
                        return bot.sendMessage(chatId, `Масса в Фунтах: ${feet.toFixed(2)}`);
                    } else if (user.conversionType === 'inches') {
                        const inches = value * 0.393701;
                        return bot.sendMessage(chatId, `Длина в Дюймах: ${inches.toFixed(2)}`);
                    } else if (user.conversionType === 'miles') {
                        const miles = value * 0.621371;
                        return bot.sendMessage(chatId, `Расстояние в Милях: ${miles.toFixed(2)}`);
                    }
                }
            }

        }
    });
};

start();

