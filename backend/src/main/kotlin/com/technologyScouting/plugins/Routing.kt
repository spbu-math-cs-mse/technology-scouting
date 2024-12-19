package com.technologyScouting.plugins

import com.github.kotlintelegrambot.Bot
import com.github.kotlintelegrambot.bot
import com.technologyScouting.*
import com.technologyScouting.resources.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.application.Application
import io.ktor.server.auth.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.openapi.*
import io.ktor.server.plugins.swagger.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.swagger.codegen.v3.generators.html.*
import mu.KotlinLogging
import org.bson.Document
import java.time.Instant
import java.util.*

val logger = KotlinLogging.logger {}

val dbService = DatabaseService()
val applicationsService = ApplicationsService(dbService.database)
val resourcesService = ResourcesService(dbService.database)
val adminAuthService = AdminAuthService(dbService.database)
val tokenStorage = dbService.database.getCollection("tokens")


fun Application.configureRouting(bot: Bot) {
    routing {
        staticResources("static", "static")

        configureCors()
        configureContentNegotiation()
        configureAuthentication()

        loginEndpoint()
        authenticatedEndpoints(bot)

        swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml") {
            version = "4.15.5"
        }
        openAPI(path = "openapi", swaggerFile = "openapi/documentation.yaml") {
            codegen = StaticHtmlCodegen()
        }
    }
}

fun Route.configureCors() {
    install(CORS) {
        anyHost()
        allowHeader(HttpHeaders.ContentType)
    }
}

fun Route.configureContentNegotiation() {
    install(ContentNegotiation) {
        json()
    }
}

fun Application.configureAuthentication() {
    install(Authentication) {
        bearer("auth-bearer") {
            realm = "Access to protected resources"
            authenticate { tokenCredential ->
                val tokenDocument = tokenStorage.find(Document("token", tokenCredential.token)).firstOrNull()
                if (tokenDocument != null && tokenDocument.getLong("expiry") > java.time.Instant.now().toEpochMilli()) {
                    UserIdPrincipal(tokenDocument.getString("login"))
                } else {
                    null
                }
            }
        }
    }
}
fun Route.authenticatedEndpoints(bot: Bot) {
    // ручки, использование которых доступно только авторизованным пользователям
    authenticate("auth-bearer") {
        getApplicationsEndpoint()
        getResourcesEndpoint()
        deleteApplicationEndpoint()
        deleteResourceEndpoint()
        createResourceEndpoint()
        createApplicationEndpoint()
        updateApplicationEndpoint()
        updateResourceEndpoint()
        addNewAdminEndpoint()
        assignResourcesEndpoint(bot)
    }
}