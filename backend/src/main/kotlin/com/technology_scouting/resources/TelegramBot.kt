package com.technology_scouting.resources

import com.github.kotlintelegrambot.Bot
import com.github.kotlintelegrambot.bot
import com.github.kotlintelegrambot.dispatch
import com.github.kotlintelegrambot.dispatcher.Dispatcher
import com.github.kotlintelegrambot.dispatcher.command
import com.github.kotlintelegrambot.dispatcher.callbackQuery
import com.github.kotlintelegrambot.dispatcher.text
import com.github.kotlintelegrambot.entities.ChatId
import com.github.kotlintelegrambot.entities.InlineKeyboardMarkup
import com.github.kotlintelegrambot.entities.keyboard.InlineKeyboardButton
import com.technology_scouting.plugins.requestsService
import com.technology_scouting.plugins.resourcesService
import java.time.LocalDateTime
import com.technology_scouting.plugins.logger

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

private var currentStep: String? = null
private var resourceName: String? = null
private var resourceDescription: String? = null
private var resourceType: String? = null
private var resourceQuantity: String? = null
private var requestType: String? = null
private var requestDescription: String? = null

private fun Dispatcher.SetUpCommands() {
    command("start") {
        val inlineKeyboardMarkup = InlineKeyboardMarkup.create(
            listOf(
                InlineKeyboardButton.CallbackData(text = "Подать ресурс", callbackData = "submit_resource"),
                InlineKeyboardButton.CallbackData(text = "Подать запрос на ресурс", callbackData = "submit_request")
            )
        )

        bot.sendMessage(
            chatId = ChatId.fromId(message.chat.id),
            text = "Привет, ${message.chat.username}! Выберите действие:",
            replyMarkup = inlineKeyboardMarkup
        )
    }

    command("help") {
        bot.sendMessage(
            chatId = ChatId.fromId(message.chat.id),
            text = "Используйте команду /start для начала работы."
        )
    }

    // Обработка inline-кнопок
    callbackQuery("submit_resource") {
        currentStep = "resource_name"
        bot.sendMessage(
            chatId = ChatId.fromId(callbackQuery.message!!.chat.id),
            text = "Введите название ресурса:"
        )
        bot.answerCallbackQuery(callbackQuery.id)
    }

    callbackQuery("submit_request") {
        currentStep = "request_type"
        bot.sendMessage(
            chatId = ChatId.fromId(callbackQuery.message!!.chat.id),
            text = "Введите тип запроса:"
        )
        bot.answerCallbackQuery(callbackQuery.id)
    }

    // Обработка текстовых сообщений для поэтапного ввода информации о ресурсе
    text {
        when (currentStep) {
            "resource_name" -> {
                resourceName = message.text
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите описание ресурса:")
                currentStep = "resource_description"
            }
            "resource_description" -> {
                resourceDescription = message.text
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите тип ресурса:")
                currentStep = "resource_type"
            }
            "resource_type" -> {
                resourceType = message.text
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите количество ресурса:")
                currentStep = "resource_quantity"
            }
            "resource_quantity" -> {
                resourceQuantity = message.text
                val userId = message.chat.username.toString()

                try {
                    resourcesService.addResource(userId, resourceName, resourceDescription, resourceType, resourceQuantity!!.toInt())
                } catch (e: Exception) {
                    logger.info("wrong message")
                }

                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Записал ваше сообщение")
                currentStep = "end"
            }
            "request_type" -> {
                requestType = message.text
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите описание запроса:")
                currentStep = "request_description"
            }
            "request_description" -> {
                requestDescription = message.text
                val userId = message.chat.username.toString()
                val currentDateTime = LocalDateTime.now()

                try {
                    requestsService.addRequest(userId, currentDateTime, requestType, requestDescription)
                } catch (e: Exception) {
                    logger.info("wrong message")
                }

                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Записал ваше сообщение")
                currentStep = "end"
            }
        }
    }
}