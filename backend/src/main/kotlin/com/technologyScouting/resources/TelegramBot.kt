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
import java.util.concurrent.ConcurrentHashMap

private val BOT_TOKEN = System.getenv("BOT_TOKEN")

/**
 * Класс хранит map из пользователя и состояния бота для этого пользователя.
 * Метод getUserState возвращает состояние по id пользователя.
 * Метод clearUserState очищает состояние для пользоваетя по id.
 */
class UserStateManager {
    private val userStates = ConcurrentHashMap<Long, UserState>()

    fun getUserState(userId: Long):
            UserState = userStates.getOrPut(userId) { UserState() }

    fun clearUserState(userId: Long) {
        userStates.remove(userId)
    }
}

/**
 * Класс хранит состояние бота для конкретного пользователя:
 * указатель на текущий вопрос бота, состояния ресурса и запроса
 * для текущего положения пользователя по пути в боте.
 */
data class UserState(
    var currentStep: String? = null,
    var newResource: Resource = Resource("", "", "", 0, "", "", emptyList(), ResourceStatus.AVAILABLE, emptyList()),
    var newApplication: Application = Application("", "", "", 0, "", Status.INCOMING, emptyList()),
)

private val userStateManager = UserStateManager()

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

/**
 * Функция отправляет текст сообщения пользователю по его id.
 */
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

/**
 * Функция обрабатывает сообщения пользователя и
 * записывает его ответы в нужный userState в map UserStateManager.
 * Затем записывает полученный ресурс или запрос в базу данных.
 */
private fun Dispatcher.setUpCommands() {
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
        val userId = callbackQuery.message!!.chat.id
        val userState = userStateManager.getUserState(userId)
        userState.currentStep = "resource_organization"

        bot.sendMessage(
            chatId = ChatId.fromId(userId),
            text = "Введите название организации:",
        )
        bot.answerCallbackQuery(callbackQuery.id)
    }

    callbackQuery("submit_request") {
        val userId = callbackQuery.message!!.chat.id
        val userState = userStateManager.getUserState(userId)
        userState.currentStep = "request_organization"

        bot.sendMessage(
            chatId = ChatId.fromId(userId),
            text = "Введите название организации:",
        )
        bot.answerCallbackQuery(callbackQuery.id)
    }

    text {
        val userId = message.chat.id
        val userState = userStateManager.getUserState(userId)

        when (userState.currentStep) {
            "resource_organization" -> {
                userState.newResource = userState.newResource.copy(organization = message.text.toString())
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите фамилию и имя для связи:")
                userState.currentStep = "resource_contact_tg"
            }

            "resource_contact_tg" -> {
                userState.newResource = userState.newResource.copy(contactName = message.text.toString())
                userState.newResource = userState.newResource.copy(telegramId = userId)
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите тему ресурса:")
                userState.currentStep = "resource_competenceField"
            }

            "resource_competenceField" -> {
                userState.newResource = userState.newResource.copy(competenceField = message.text.toString())
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите описание ресурса:")
                userState.currentStep = "resource_description"
            }

            "resource_description" -> {
                userState.newResource = userState.newResource.copy(competenceField = message.text.toString())
                bot.sendMessage(
                    chatId = ChatId.fromId(message.chat.id),
                    text = "Введите ключевые слова для вашего ресурса (пишите тэги через запятую):",
                )
                userState.currentStep = "resource_tags"
            }

            "resource_tags" -> {
                userState.newResource =
                    userState.newResource.copy(
                        tags =
                            message
                                .text!!
                                .split(",")
                                .map { it.trim() }
                                .filter { it.isNotEmpty() },
                    )

                userState.newResource = userState.newResource.copy(status = ResourceStatus.IN_WORK)
                try {
                    resourcesService.addResource(
                        userState.newResource.organization,
                        userState.newResource.contactName,
                        userState.newResource.telegramId,
                        userState.newResource.competenceField,
                        userState.newResource.description,
                        userState.newResource.tags,
                        userState.newResource.status,
                    )
                } catch (e: Exception) {
                    logger.info("wrong resource")
                }

                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Записал ваше сообщение")
                userStateManager.clearUserState(userId)
            }

            "request_organization" -> {
                userState.newApplication = userState.newApplication.copy(organization = message.text.toString())
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите фамилию и имя для связи:")
                userState.currentStep = "request_contact_tg"
            }

            "request_contact_tg" -> {
                userState.newApplication = userState.newApplication.copy(contactName = message.text.toString())
                userState.newApplication = userState.newApplication.copy(telegramId = userId)
                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Введите свой запрос:")
                userState.currentStep = "request_text"
            }

            "request_text" -> {
                userState.newApplication = userState.newApplication.copy(requestText = message.text.toString())
                userState.newApplication = userState.newApplication.copy(status = Status.INCOMING)
                try {
                    applicationsService.addApplication(
                        userState.newApplication.organization,
                        userState.newApplication.contactName,
                        userState.newApplication.telegramId,
                        userState.newApplication.requestText,
                        userState.newApplication.status,
                    )
                } catch (e: Exception) {
                    logger.info("wrong application")
                }

                bot.sendMessage(chatId = ChatId.fromId(message.chat.id), text = "Записал ваше сообщение")
                userStateManager.clearUserState(userId)
            }
        }
    }
}
