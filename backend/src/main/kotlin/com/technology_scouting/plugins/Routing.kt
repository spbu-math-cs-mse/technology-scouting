package com.technology_scouting.plugins

import com.github.kotlintelegrambot.Bot
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
import com.technology_scouting.resources.*
import io.ktor.server.request.*
import mu.KotlinLogging

val logger = KotlinLogging.logger {}

val dbService = DatabaseService()
val requestsService = RequestsService(dbService.database)
val resourcesService = ResourcesService(dbService.database)

fun Application.configureRouting() {
    routing {

        staticResources("static", "static")

        val bot = CreateBot()
        bot.startPolling()
        //dbService.closeConnection()

        install(CORS) {
            anyHost()
            allowHeader(HttpHeaders.ContentType)
        }
        install(ContentNegotiation) {
            json()
        }

        get("/api/requests") {
            try{
                var requests: List<Request> =  requestsService.getAllRequests()

                call.respond(Requests(requests))
            }
            catch (e: Exception){
                call.respond(HttpStatusCode.Unauthorized, Error("Failed to connect with database"))
            }
        }
        get("/api/resources") {
            try{
                var resources: List<Resource> = resourcesService.getAllResources()

                call.respond(Resources(resources))
            }
            catch (e: Exception){
                call.respond(HttpStatusCode.Unauthorized, Error("Failed to connect with database"))
            }
        }
        post("/api/delete_request") {
            val id = call.receive<Id>()
            try{
                requestsService.deleteRequest(id.id)

                call.respond((HttpStatusCode.OK))
            }
            catch (e: Exception){
                call.respond(HttpStatusCode.Unauthorized, Error("Failed to connect with database"))
            }
        }
        post("/api/delete_resource") {
            val id = call.receive<Id>()
            try{
                resourcesService.deleteResource(id.id)

                call.respond((HttpStatusCode.OK))
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