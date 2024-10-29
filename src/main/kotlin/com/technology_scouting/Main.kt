package com.technology_scouting

import com.github.kotlintelegrambot.bot
import com.github.kotlintelegrambot.dispatch
import com.github.kotlintelegrambot.dispatcher.*
import com.github.kotlintelegrambot.entities.*

private val BOT_TOKEN = System.getenv("BOT_TOKEN")

fun main() {
    val bot = bot {
        token = BOT_TOKEN
        dispatch {
            text {
                var Message = ChatId.fromId(message.chat.id) // сюда запоминается смс-ка
                bot.sendMessage( // это он просто пока пишет на экран то, что ты ввел(просто понимать
                    // работает бот или нет)
                    chatId = Message,
                    messageThreadId = message.messageThreadId,
                    text = text,
                    protectContent = true,
                    disableNotification = false,
                )
            }
            command("start") {
                val result = bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Hi there!")
                result.fold({
                    // do something here with the response
                },{
                    // do something with the error
                })
            }
            command("help") {
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "иди нахуй")
            }
        }
    }
    bot.startPolling()
}