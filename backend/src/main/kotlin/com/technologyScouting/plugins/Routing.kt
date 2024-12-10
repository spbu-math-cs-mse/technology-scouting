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

        install(CORS) {
            anyHost()
            allowHeader(HttpHeaders.ContentType)
        }
        install(ContentNegotiation) {
            json()
        }
        install(Authentication) {
            bearer("auth-bearer") {
                realm = "Access to protected resources"
                authenticate { tokenCredential ->
                    val tokenDocument = tokenStorage.find(Document("token", tokenCredential.token)).firstOrNull()
                    if (tokenDocument != null && tokenDocument.getLong("expiry") > Instant.now().toEpochMilli()) {
                        UserIdPrincipal(tokenDocument.getString("login"))
                    } else {
                        null
                    }
                }
            }
        }

        post("/api/login") {
            try {
                val credentials = call.receive<LogIn>()

                val isValidUser = adminAuthService.verifyAdmin(credentials.login, credentials.password)

                if (isValidUser) {
                    val token = UUID.randomUUID().toString()
                    println("valid user confirmed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + token)
                    val expiryTime = Instant.now().plusSeconds(3600).toEpochMilli() // Токен на 1 час

                    tokenStorage.insertOne(
                        Document()
                            .append("token", token)
                            .append("login", credentials.login)
                            .append("expiry", expiryTime),
                    )

                    call.respond(Token(token))
                } else {
                    throw Exception()
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.Unauthorized, UnauthorizedError)
            }
        }

        authenticate("auth-bearer") {
            get("/api/applications") {
                try {
                    val applications: List<ApplicationWithId> = applicationsService.getAllApplications()

                    call.respond(Applications(applications))
                } catch (e: Exception) {
                    println(e.message)
                    call.respond(HttpStatusCode.Unauthorized, Error("Failed to connect with database"))
                }
            }
            get("/api/resources") {
                try {
                    val resources: List<ResourceWithId> = resourcesService.getAllResources()

                    call.respond(Resources(resources))
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.Unauthorized, Error("Failed to connect with database"))
                }
            }
            post("/api/delete_application") {
                val id = call.receive<Id>()

                try {
                    val deleted = applicationsService.deleteApplication(id._id)

                    if (!deleted) {
                        throw NotFoundException()
                    }

                    call.respond((HttpStatusCode.OK))
                } catch (notFound: NotFoundException) {
                    call.respond(HttpStatusCode.NotFound)
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.Unauthorized, UnauthorizedError)
                }
            }
            post("/api/delete_resource") {
                val id = call.receive<Id>()

                try {
                    val deleted = resourcesService.deleteResource(id._id)

                    if (!deleted) {
                        throw NotFoundException()
                    }

                    call.respond((HttpStatusCode.OK))
                } catch (notFound: NotFoundException) {
                    call.respond(HttpStatusCode.NotFound)
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.Unauthorized, UnauthorizedError)
                }
            }
            post("/api/create_resource") {
                val resource = call.receive<InputResource>()
                var status: ResourceStatus = ResourceStatus.IN_WORK
                if (!ResourceStatus.entries.toTypedArray().map {
                            it ->
                        it.toString()
                    }.contains(resource.status.uppercase(Locale.getDefault()).replace(' ', '_'))
                ) {
                    call.respond(HttpStatusCode.NotFound, UnauthorizedError)
                } else {
                    status = ResourceStatus.valueOf(resource.status.uppercase(Locale.getDefault()).replace(' ', '_'))
                }

                try {
                    val newId =
                        resourcesService
                            .addResource(
                                resource.organization,
                                resource.contactName,
                                resource.telegramId,
                                resource.competenceField,
                                resource.description,
                                resource.tags,
                                status,
                            )

                    if (newId == null) {
                        throw Exception()
                    }

                    call.respond(HttpStatusCode.OK, Id(newId))
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.Unauthorized, UnauthorizedError)
                }
            }
            post("/api/create_application") {
                val application = call.receive<com.technologyScouting.InputApplication>()
                var status: Status = Status.INCOMING
                if (!Status.entries.toTypedArray().map {
                            it ->
                        it.toString()
                    }.contains(application.status.uppercase(Locale.getDefault()).replace(' ', '_'))
                ) {
                    call.respond(HttpStatusCode.NotFound, UnauthorizedError)
                } else {
                    status = Status.valueOf(application.status.uppercase(Locale.getDefault()).replace(' ', '_'))
                }

                try {
                    val newId =
                        applicationsService
                            .addApplication(
                                application.organization,
                                application.contactName,
                                application.telegramId,
                                application.requestText,
                                status,
                            )

                    if (newId == null) {
                        throw Exception()
                    }

                    call.respond(HttpStatusCode.OK, Id(newId))
                } catch (e: Exception) {
                    println(e.message)
                    call.respond(HttpStatusCode.Unauthorized, UnauthorizedError)
                }
            }
            post("/api/update_application") {
                val newApplication = call.receive<ApplicationWithId>()

                try {
                    val updatedValues =
                        mapOf(
                            ApplicationFields.ID to newApplication._id,
                            ApplicationFields.STATUS to newApplication.status,
                            ApplicationFields.DATE to newApplication.date,
                            ApplicationFields.TELEGRAM_ID to newApplication.telegramId,
                            ApplicationFields.CONTACT_NAME to newApplication.contactName,
                            ApplicationFields.ORGANIZATION to newApplication.organization,
                            ApplicationFields.REQUEST_TEXT to newApplication.requestText,
                        )

                    applicationsService.updateApplication(newApplication._id, updatedValues)

                    call.respond((HttpStatusCode.OK))
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.Unauthorized, UnauthorizedError)
                }
            }
            post("/api/update_resource") {
                val newResource = call.receive<ResourceWithId>()

                try {
                    val updatedValues =
                        mapOf(
                            ResourceFields.ID to newResource._id,
                            ResourceFields.COMPETENCE_FIELD to newResource.competenceField,
                            ResourceFields.TAGS to newResource.tags,
                            ResourceFields.STATUS to newResource.status,
                            ResourceFields.DATE to newResource.date,
                            ResourceFields.CONTACT_NAME to newResource.contactName,
                            ResourceFields.DESCRIPTION to newResource.description,
                            ResourceFields.ORGANIZATION to newResource.organization,
                            ResourceFields.TELEGRAM_ID to newResource.telegramId,
                        )

                    resourcesService.updateResource(newResource._id, updatedValues)

                    call.respond((HttpStatusCode.OK))
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.Unauthorized, UnauthorizedError)
                }
            }
            post("/api/add_new_admin") {
                val newAdmin = call.receive<NewAdmin>()

                try {
                    adminAuthService.addAdmin(newAdmin.login, newAdmin.password)

                    call.respond((HttpStatusCode.OK))
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.Unauthorized, UnauthorizedError)
                }
            }

            post("/api/assign_resources") {
                val attacher = call.receive<Attacher>()

                try {
                    val applicationId = attacher.applicationId

                    applicationsService.setApplicationStatus(applicationId, Status.IN_WORK)
                    for (resourceId in attacher.resourceIds) {
                        applicationsService.addResourceToApplication(applicationId, resourceId)
                        resourcesService.addApplicationToResource(resourceId, applicationId)
                        resourcesService.setResourceStatus(resourceId, ResourceStatus.IN_WORK)
                        var tg = resourcesService.getResource(resourceId)?.telegramId
                        bot.sendMessagesToUsersByUsername(tg!!, attacher.message)
                    }

                    call.respond((HttpStatusCode.OK))
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.Unauthorized, UnauthorizedError)
                }
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
