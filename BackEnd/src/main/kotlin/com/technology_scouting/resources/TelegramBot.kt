package com.technology_scouting.resources

import com.github.kotlintelegrambot.Bot
import com.github.kotlintelegrambot.bot
import com.github.kotlintelegrambot.dispatch
import com.github.kotlintelegrambot.dispatcher.Dispatcher
import com.github.kotlintelegrambot.dispatcher.command
import com.github.kotlintelegrambot.entities.ChatId
import com.technology_scouting.plugins.logger
import com.technology_scouting.plugins.userService

private val BOT_TOKEN = System.getenv("BOT_TOKEN")

fun CreateBot(): Bot {
    return bot {
        if (BOT_TOKEN == null){
            throw IllegalArgumentException()
        }
        token = BOT_TOKEN
        dispatch {
            SetUpCommands()
        }
    }
}
private fun Dispatcher.SetUpCommands() {
    command("start") {
        bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Hi!" + message.chat.username)
    }
    command("help") {
        bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "При помощи команды /enquire вы можете отправить свой запрос в базу данных.\n" +
                "Для этого напишите свой текст в одном сообщении после данной команды.")
    }
    command("enquire") {
        val result = bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Записал ваше сообщение")
        result.fold({
            val userId = message.chat.username.toString()
            val userMessage = message.text!!.substring(8, message.text!!.length).trim()
            userService.addUserRecord(userId, userMessage)
        },{
            logger.info("wrong message")
        })
    }
}