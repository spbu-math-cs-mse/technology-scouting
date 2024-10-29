package com.technology_scouting

import com.github.kotlintelegrambot.bot
import com.github.kotlintelegrambot.dispatch
import com.github.kotlintelegrambot.dispatcher.*
import com.github.kotlintelegrambot.entities.*

private val BOT_TOKEN = System.getenv("BOT_TOKEN")

fun main() {
    val dbService = DatabaseService()
    val userService = UserService(dbService.database)

    val users = userService.getUserRecords()
    users.forEach { println(it) }

    val bot = bot {
        token = BOT_TOKEN
        dispatch {
            text {
                var Message = ChatId.fromId(message.chat.id) // сюда запоминается смс-ка
                /*bot.sendMessage( // это он просто пока пишет на экран то, что ты ввел(просто понимать
                    // работает бот или нет)
                    chatId = Message,
                    messageThreadId = message.messageThreadId,
                    text = text,
                    protectContent = true,
                    disableNotification = false,
                )*/
            }
            command("start") {
                val result = bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Hi!")
                result.fold({
                    // do something here with the response
                },{
                    // do something with the error
                })
            }
            command("help") {
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "При помоши команды /enquire вы можете отправить свой запрос в базу данных.\n" +
                        "Для этого напишите свой текст в одном сообщении после данной команды.")
            }
            command("enquire") {
                val result = bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Записал ваше сообщение")
                result.fold({
                    val userId = message.chat.username.toString()
                    val userMessage = message.text!!.substring(8, message.text!!.length).trim()
                    userService.addUserRecord(userId, userMessage)
                },{
                    // do something with the error
                })
            }
        }
    }
    bot.startPolling()
    //dbService.closeConnection()
}