package com.technologyscouting.plugins

import com.github.kotlintelegrambot.bot
import com.github.kotlintelegrambot.dispatcher.*
import com.github.kotlintelegrambot.entities.*
import com.technologyscouting.*
import com.technologyscouting.resources.DatabaseService
import com.technologyscouting.resources.TelegramBot
import com.technologyscouting.resources.UserService
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.openapi.*
import io.ktor.server.plugins.swagger.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.swagger.codegen.v3.generators.html.*
import mu.KotlinLogging

val logger = KotlinLogging.logger {}

val dbService = DatabaseService()
val userService = UserService(dbService.database)

fun Application.configureRouting() {
    routing {
        staticResources("static", "static")

        val users = userService.getUserRecords()
        users.forEach { println(it) }

        val bot =
            TelegramBot()
                .bot()
        bot.startPolling()
        // dbService.closeConnection()

        install(CORS) {
            anyHost()
            allowHeader(HttpHeaders.ContentType)
        }
        install(ContentNegotiation) {
            json()
        }

        get("/api/user-list") {
            try {
                var items: MutableList<Item> = mutableListOf()
                val itemsFromDb = userService.getUserRecords()

                for (item in itemsFromDb) {
                    items.add(Item(item.first, item.second))
                }

                call.respond(History(items))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.Unauthorized, Error("Failed to connect with database"))
            }
        }

        swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml") {
            version = "4.15.5"
        }
        openAPI(path = "openapi", swaggerFile = "openapi/documentation.yaml") {
            codegen = StaticHtmlCodegen()
        }
    }
}
