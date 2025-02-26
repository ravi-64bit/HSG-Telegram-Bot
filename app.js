const TelegramBot = require('node-telegram-bot-api');
const secrets = require('./keys');

const token = secrets.botkey;
const bot = new TelegramBot(token, { polling: true });

bot.setMyCommands([
    { command: '/start', description: 'Welcome message' },
    { command: '/search', description: 'Search a relevant blog' },
    { command: '/subscribe', description: 'Subscribe to our newsletter' },
    { command: '/stop', description: 'Unsubscribe from newsletter' }
]);

bot.onText(/\/start/, (msg) => {
    const id = msg.chat.id;
    const user=msg.from.first_name;
    const message = `Hello ${user}, I'm a bot that can help you find study abroad-related content. You can:\n\n` +
                    `🔍 Search a relevant blog: /search <keyword>\n📩 Subscribe to our newsletter: /subscribe <your_email>\n🚫 Stop subscription: /stop`;

    bot.sendMessage(id, message);
});

bot.onText(/\/search (.+)/, (msg, match) => {
    const id = msg.chat.id;
    const query = match[1];

    if (!query) {
        bot.sendMessage(id, "❌ Please enter your query after /search, e.g., `/search visa`", { parse_mode: "Markdown" });
        return;
    }

    const encodedQuery = query.trim().split(/\s+/).join("+");
    const resURL = `https://www.hellostudy.org/searchresults?q=${encodedQuery}&type=blogs`;

    bot.sendMessage(id, `🔎 Here are the results for *${query}*:\n[Click here to view results](${resURL})`, { parse_mode: "Markdown" });
});


bot.onText(/\/subscribe (.+)/, (msg, match) => {
    const id = msg.chat.id;
    const email = match[1];

    if (!email) {
        bot.sendMessage(id, "❌ Please enter your email after /subscribe, e.g., `/subscribe example@email.com`");
        return;
    }

    // Here, you can integrate email subscription logic (e.g., save email to a database)

    bot.sendMessage(id, `✅ You have been successfully subscribed with *${email}*!`);
});

bot.onText(/\/stop/, (msg) => {
    bot.sendMessage(msg.chat.id, "🚫 You have been unsubscribed. Send /start to restart the bot.");
});

console.log("🤖 Bot is running...");
