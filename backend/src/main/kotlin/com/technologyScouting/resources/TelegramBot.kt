package com.technologyScouting.resources

import com.github.kotlintelegrambot.Bot
import com.github.kotlintelegrambot.bot
import com.github.kotlintelegrambot.dispatch
import com.github.kotlintelegrambot.dispatcher.Dispatcher
import com.github.kotlintelegrambot.dispatcher.callbackQuery
import com.github.kotlintelegrambot.dispatcher.command
import com.github.kotlintelegrambot.dispatcher.text
import com.github.kotlintelegrambot.entities.ChatId
import com.github.kotlintelegrambot.entities.InlineKeyboardMarkup
import com.github.kotlintelegrambot.entities.keyboard.InlineKeyboardButton
import com.technologyScouting.Application
import com.technologyScouting.Resource
import com.technologyScouting.ResourceStatus
import com.technologyScouting.Status
import com.technologyScouting.plugins.applicationsService
import com.technologyScouting.plugins.logger
import com.technologyScouting.plugins.resourcesService

private val BOT_TOKEN = System.getenv("BOT_TOKEN")

fun createBot(): Bot =
    bot {
        if (BOT_TOKEN == null) {
            throw IllegalArgumentException()
        }
        token = BOT_TOKEN
        dispatch {
            setUpCommands()
        }
    }

fun Bot.sendMessagesToUsersByUsername(
    id: Long,
    message: String,
) {
    try {
        this.sendMessage(
            chatId = ChatId.fromId(id),
            text = message,
        )
    } catch (e: Exception) {
        logger.error("Failed to send message to user $id: ${e.message}")

    }
}

private var currentStep: String? = null

private fun Dispatcher.setUpCommands() {
    var newResource = Resource("", "", "", 0, "", "", emptyList(), ResourceStatus.AVAILABLE)
    var newApplication = Application("", "", "", 0, "", Status.INCOMING)
    command("start") {
        val inlineKeyboardMarkup =
            InlineKeyboardMarkup.create(
                listOf(
                    InlineKeyboardButton.CallbackData(text = "Подать ресурс", callbackData = "submit_resource"),
                    InlineKeyboardButton.CallbackData(
                        text = "Подать запрос на ресурс",
                        callbackData = "submit_request",
                    ),
                ),
            )

        bot.sendMessage(
            chatId = ChatId.fromId(message.chat.id),
            text = "Привет, ${message.chat.username}! Выберите действие:",
            replyMarkup = inlineKeyboardMarkup,
        )
    }

    command("help") {
        bot.sendMessage(
            chatId = ChatId.fromId(message.chat.id),
            text = "Используйте команду /start для начала работы.",
        )
    }

    callbackQuery("submit_resource") {
        currentStep = "resource_organization"
        bot.sendMessage(
            chatId = ChatId.fromId(callbackQuery.message!!.chat.id),
            text = "Введите название организации:",
        )
        bot.answerCallbackQuery(callbackQuery.id)
    }

    callbackQuery("submit_request") {
        currentStep = "request_organization"
        bot.sendMessage(
            chatId = ChatId.fromId(callbackQuery.message!!.chat.id),
            text = "Введите название организации:",
        )
        bot.answerCallbackQuery(callbackQuery.id)
    }

    text {
        when (currentStep) {
            "resource_organization" -> {
                newResource = newResource.copy(organization = message.text.toString())
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите фамилию и имя для связи:")
                currentStep = "resource_contact"
            }

            "resource_contact" -> {
                newResource = newResource.copy(contactName = message.text.toString())
                // bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите ссылку на свой контакт (ник в telegram):")
                currentStep = "resource_tg"
            }

            "resource_tg" -> {
                newResource = newResource.copy(telegramId = message.chat.id)
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите тему ресурса:")
                currentStep = "resource_competenceField"
            }

            "resource_competenceField" -> {
                newResource = newResource.copy(competenceField = message.text.toString())
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите описание ресурса:")
                currentStep = "resource_description"
            }

            "resource_description" -> {
                newResource = newResource.copy(description = message.text.toString())
                bot.sendMessage(
                    chatId = ChatId.fromId(message.chat.id),
                    text = "Введите ключевые слова для вашего ресурса (пишите тэги через запятую):",
                )
                currentStep = "resource_tags"
            }

            "resource_tags" -> {
                newResource =
                    newResource.copy(
                        tags =
                            message
                                .text!!
                                .split(",")
                                .map { it.trim() }
                                .filter { it.isNotEmpty() },
                    )

                newResource = newResource.copy(status = ResourceStatus.IN_WORK)
                try {
                    resourcesService.addResource(
                        newResource.organization,
                        newResource.contactName,
                        newResource.telegramId,
                        newResource.competenceField,
                        newResource.description,
                        newResource.tags,
                        newResource.status,
                    )
                } catch (e: Exception) {
                    logger.info("wrong resource")
                }

                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Записал ваше сообщение")
                currentStep = "end"
            }

            "request_organization" -> {
                newApplication = newApplication.copy(organization = message.text.toString())
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите фамилию и имя для связи:")
                currentStep = "request_contact"
            }

            "request_contact" -> {
                newApplication = newApplication.copy(contactName = message.text.toString())
                // bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите ссылку на свой контакт:")
                currentStep = "request_tg"
            }

            "request_tg" -> {
                newApplication = newApplication.copy(telegramId = message.chat.id)
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите свой запрос:")
                currentStep = "request_text"
            }

            "request_text" -> {
                newApplication = newApplication.copy(requestText = message.text.toString())
                newApplication = newApplication.copy(status = Status.INCOMING)
                try {
                    applicationsService.addApplication(
                        newApplication.organization,
                        newApplication.contactName,
                        newApplication.telegramId,
                        newApplication.requestText,
                        newApplication.status,
                    )
                } catch (e: Exception) {
                    logger.info("wrong application")
                }

                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Записал ваше сообщение")
                currentStep = "end"
            }
        }
    }
}
