package com.technology_scouting.plugins

import com.technology_scouting.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.plugins.swagger.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.openapi.*
import io.swagger.codegen.v3.generators.html.*
import com.github.kotlintelegrambot.bot
import com.github.kotlintelegrambot.dispatch
import com.github.kotlintelegrambot.dispatcher.*
import com.github.kotlintelegrambot.entities.*
import com.technology_scouting.resources.DatabaseService
import com.technology_scouting.resources.UserService
import mu.KotlinLogging

private val logger = KotlinLogging.logger {}

private val BOT_TOKEN = System.getenv("BOT_TOKEN")

fun Application.configureRouting() {
    routing {

        staticResources("static", "static")

        val dbService = DatabaseService()
        val userService = UserService(dbService.database)

        val users = userService.getUserRecords()
        users.forEach { println(it) }

        val bot = bot {
            token = BOT_TOKEN
            dispatch {
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
        }
        bot.startPolling()
        //dbService.closeConnection()

        install(CORS) {
            anyHost()
            allowHeader(HttpHeaders.ContentType)
        }
        install(ContentNegotiation) {
            json()
        }

        get("/api/user-list") {
            try{
                var items: MutableList<Item> = mutableListOf()
                var items_from_db = userService.getUserRecords()

                for(item in items_from_db)
                {
                    items.add(Item(item.first, item.second))
                }

                call.respond(History(items))
            }
            catch (e: Exception){
                call.respond(HttpStatusCode.Unauthorized, Error("Failed to connect with database"))
            }
        }

        swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml") {
            version = "4.15.5"
        }
        openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml") {
            codegen = StaticHtmlCodegen()
        }
    }
}