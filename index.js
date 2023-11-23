const TelegramApi = require('node-telegram-bot-api');

const token = '6327113627:AAE8Tb2HR-FZh9Jm79R8GDaman2PYiiKFrs';

const bot = new TelegramApi(token, { polling: true });

const users = {}; // Holds information about current users

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Greeting' },
    ]);

    bot.on('message', async msg => {
        // console.log(msg);
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6be/bac/6bebac93-1f42-4f06-972d-be9211de33f2/8.webp');
            return bot.sendMessage(chatId, 'Hi, choose an option:', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '°C=>°F', callback_data: 'convertToF' }],
                        [{ text: '°F=>°C', callback_data: 'convertToC' }],
                        [{ text: 'Kg=>Lbs', callback_data: 'convertToFeet' }],
                        [{ text: 'Lbs=>Kg', callback_data: 'convertToKg' }],
                        [{ text: 'Cm=>Inch', callback_data: 'convertToInches' }],
                        [{ text: 'Inch=>Cm', callback_data: 'convertToCm' }],
                        [{ text: 'Km=>Miles', callback_data: 'convertToMiles' }],
                        [{ text: 'Miles=>Km', callback_data: 'convertToKm' }]
                    ]
                }
            });
        }
    });

    bot.on('callback_query', async query => {
        const chatId = query.message.chat.id;

        if (query.data === 'convertToF' || query.data === 'convertToC' || query.data === 'convertToFeet' || query.data === 'convertToKg' || query.data === 'convertToInches' || query.data === 'convertToCm' || query.data === 'convertToMiles' || query.data === 'convertToKm') {
            users[chatId] = { conversionType: query.data };
            const conversionMessage = getConversionMessage(query.data);
            await bot.sendMessage(chatId, conversionMessage);
        }
    });

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (!msg.entities || msg.entities[0].type !== 'bot_command') {
            // Assuming the user input is a valid number
            const value = parseFloat(text);

            if (isNaN(value)) {
                return bot.sendMessage(chatId, 'Enter a number.');
            }

            const user = users[chatId];

            if (user) {
                const conversionResult = performConversion(user.conversionType, value);
                return bot.sendMessage(chatId, conversionResult);
            }
        }
    });
};

const getConversionMessage = (conversionType) => {
    switch (conversionType) {
        case 'convertToF':
            return 'Enter temperature in Celsius:';
        case 'convertToC':
            return 'Enter temperature in Fahrenheit:';
        case 'convertToFeet':
            return 'Enter weight in kilograms for conversion to Pounds:';
        case 'convertToKg':
            return 'Enter weight in Pounds for conversion to Kilograms:';
        case 'convertToInches':
            return 'Enter length in centimeters for conversion to Inches:';
        case 'convertToCm':
            return 'Enter length in Inches for conversion to Centimeters:';
        case 'convertToMiles':
            return 'Enter distance in kilometers for conversion to Miles:';
        case 'convertToKm':
            return 'Enter distance in Miles for conversion to Kilometers:';
        default:
            return 'Invalid conversion type.';
    }
};

const performConversion = (conversionType, value) => {
    switch (conversionType) {
        case 'convertToF':
            const fahrenheitTemperature = (value * 9 / 5) + 32;
            return `Temperature in Fahrenheit: ${fahrenheitTemperature.toFixed(2)}`;
        case 'convertToC':
            const celsiusTemperature = (value - 32) * 5 / 9;
            return `Temperature in Celsius: ${celsiusTemperature.toFixed(2)}`;
        case 'convertToFeet':
            const pounds = value * 2.20462;
            return `Weight in Pounds: ${pounds.toFixed(2)}`;
        case 'convertToKg':
            const kilograms = value / 2.20462;
            return `Weight in Kilograms: ${kilograms.toFixed(2)}`;
        case 'convertToInches':
            const inches = value * 0.393701;
            return `Length in Inches: ${inches.toFixed(2)}`;
        case 'convertToCm':
            const centimeters = value / 0.393701;
            return `Length in Centimeters: ${centimeters.toFixed(2)}`;
        case 'convertToMiles':
            const miles = value * 0.621371;
            return `Distance in Miles: ${miles.toFixed(2)}`;
        case 'convertToKm':
            const kilometers = value / 0.621371;
            return `Distance in Kilometers: ${kilometers.toFixed(2)}`;
        default:
            return 'Invalid conversion type.';
    }
};

start();

