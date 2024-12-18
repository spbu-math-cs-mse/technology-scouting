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

                    call.respond(Token(token, 3600))
                } else {
                    throw SecurityException()
                }
            } catch (e: SecurityException) {

                call.respond(HttpStatusCode.Unauthorized, UnauthorizedError)

            }
        }

        authenticate("auth-bearer") {
            get("/api/applications") {
                try {
                    val applications: List<ApplicationWithId> = applicationsService.getAllApplications()

                    call.respond(Applications(applications))
                } catch (e: Exception) {

                    call.respond(HttpStatusCode.ServiceUnavailable) //бд сломалась

                }
            }

            get("/api/resources") {
                try {
                    val resources: List<ResourceWithId> = resourcesService.getAllResources()

                    call.respond(Resources(resources))
                } catch (e: Exception) {

                    call.respond(HttpStatusCode.ServiceUnavailable) //бд сломалась

                }
            }

            post("/api/delete_application") {
                val id = call.receive<Id>()

                try {
                    val deleted = applicationsService.deleteApplication(id._id)

                    if (!deleted)
                        throw NotFoundException()

                    val applications: List<ApplicationWithId> = applicationsService.getAllApplications()

                    call.respond(Applications(applications))

                } catch (notFound: NotFoundException) {

                    call.respond(HttpStatusCode.NotFound) //не найдено

                } catch (invArg: IllegalArgumentException) {

                    call.respond(HttpStatusCode.BadRequest) //длина 24

                } catch (e: Exception) {

                    call.respond(HttpStatusCode.ServiceUnavailable) //бд нету

                }
            }

            post("/api/delete_resource") {
                val id = call.receive<Id>()

                try {
                    val deleted = resourcesService.deleteResource(id._id)

                    if (!deleted) {
                        throw NotFoundException()
                    }

                    val resources: List<ResourceWithId> = resourcesService.getAllResources()

                    call.respond(Resources(resources))

                } catch (notFound: NotFoundException) {

                    call.respond(HttpStatusCode.NotFound) //не найдено

                } catch (invArg: IllegalArgumentException) {

                    call.respond(HttpStatusCode.BadRequest) //длина 24

                } catch (e: Exception) {

                    call.respond(HttpStatusCode.ServiceUnavailable) //бд нету

                }
            }

            post("/api/create_resource") {
                try {
                    val resource = call.receive<InputResource>()
                    var status: ResourceStatus = ResourceStatus.IN_WORK
                    if (!ResourceStatus.entries.toTypedArray().map { it ->
                            it.toString()
                        }.contains(resource.status.uppercase(Locale.getDefault()).replace(' ', '_'))
                    ) {
                        throw IllegalArgumentException()
                    } else {
                        status =
                            ResourceStatus.valueOf(resource.status.uppercase(Locale.getDefault()).replace(' ', '_'))
                    }
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
                        throw BadRequestException("Database broke down")
                    }

                    val resources: List<ResourceWithId> = resourcesService.getAllResources()

                    call.respond(Resources(resources))

                } catch (invArg: IllegalArgumentException) {

                    call.respond(HttpStatusCode.BadRequest) //неверные аргументы

                } catch (e: Exception) {

                    call.respond(HttpStatusCode.ServiceUnavailable) //бд нету

                }
            }

            post("/api/create_application") {
                try {
                    val application = call.receive<com.technologyScouting.InputApplication>()
                    var status: Status = Status.INCOMING

                    if (!Status.entries.toTypedArray().map { it ->
                            it.toString()
                        }.contains(application.status.uppercase(Locale.getDefault()).replace(' ', '_'))
                    ) {
                        throw IllegalArgumentException()
                    } else {
                        status = Status.valueOf(application.status.uppercase(Locale.getDefault()).replace(' ', '_'))
                    }

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

                    val applications: List<ApplicationWithId> = applicationsService.getAllApplications()

                    call.respond(Applications(applications))

                } catch (invArg: IllegalArgumentException) {

                    call.respond(HttpStatusCode.BadRequest) //неверные аргументы

                } catch (e: Exception) {

                    call.respond(HttpStatusCode.ServiceUnavailable) //бд нету
                }

                post("/api/update_application") {
                    val newApplication = call.receive<ApplicationWithId>()

                    try {
                        var status: Status = Status.INCOMING
                        if (!Status.entries.toTypedArray().map { it ->
                                it.toString()
                            }.contains(newApplication.status.uppercase(Locale.getDefault()).replace(' ', '_'))
                        ) {
                            throw IllegalArgumentException()
                        } else {
                            status =
                                Status.valueOf(newApplication.status.uppercase(Locale.getDefault()).replace(' ', '_'))
                        }

                        val updatedValues =
                            mapOf(
                                ApplicationFields.ID to newApplication._id,
                                ApplicationFields.DATE to newApplication.date,
                                ApplicationFields.TELEGRAM_ID to newApplication.telegramId,
                                ApplicationFields.CONTACT_NAME to newApplication.contactName,
                                ApplicationFields.ORGANIZATION to newApplication.organization,
                                ApplicationFields.REQUEST_TEXT to newApplication.requestText,
                                ApplicationFields.STATUS to status,
                            )
                        val cnt = applicationsService.updateApplication(newApplication._id, updatedValues)
                        if (!cnt)
                            throw NotFoundException()

                        val applications: List<ApplicationWithId> = applicationsService.getAllApplications()

                        call.respond(Applications(applications))

                    } catch (notFound: NotFoundException) {

                        call.respond(HttpStatusCode.NotFound) //не найдено

                    } catch (invArg: IllegalArgumentException) {

                        call.respond(HttpStatusCode.BadRequest) //неверные аргументы

                    } catch (e: Exception) {

                        call.respond(HttpStatusCode.ServiceUnavailable) //бд нету

                    }
                }

                post("/api/update_resource") {
                    val newResource = call.receive<ResourceWithId>()

                    try {
                        var status: ResourceStatus = ResourceStatus.IN_WORK
                        if (!ResourceStatus.entries.toTypedArray().map { it ->
                                it.toString()
                            }.contains(newResource.status.uppercase(Locale.getDefault()).replace(' ', '_'))
                        ) {
                            throw IllegalArgumentException()
                        } else {
                            status = ResourceStatus.valueOf(
                                newResource.status.uppercase(Locale.getDefault()).replace(' ', '_')
                            )
                        }
                        val updatedValues =
                            mapOf(
                                ResourceFields.ID to newResource._id,
                                ResourceFields.COMPETENCE_FIELD to newResource.competenceField,
                                ResourceFields.TAGS to newResource.tags,
                                ResourceFields.STATUS to status,
                                ResourceFields.DATE to newResource.date,
                                ResourceFields.CONTACT_NAME to newResource.contactName,
                                ResourceFields.DESCRIPTION to newResource.description,
                                ResourceFields.ORGANIZATION to newResource.organization,
                                ResourceFields.TELEGRAM_ID to newResource.telegramId,
                            )

                        val cnt = resourcesService.updateResource(newResource._id, updatedValues)
                        if (!cnt)
                            throw NotFoundException()

                        val resources: List<ResourceWithId> = resourcesService.getAllResources()

                        call.respond(Resources(resources))

                    } catch (notFound: NotFoundException) {

                        call.respond(HttpStatusCode.NotFound) //не найдено

                    } catch (invArg: IllegalArgumentException) {

                        call.respond(HttpStatusCode.BadRequest) //неверные аргументы

                    } catch (e: Exception) {

                        call.respond(HttpStatusCode.ServiceUnavailable) //бд нету

                    }
                }

                post("/api/add_new_admin") {
                    val newAdmin = call.receive<NewAdmin>()

                    try {
                        adminAuthService.addAdmin(newAdmin.login, newAdmin.password)

                        call.respond((HttpStatusCode.OK))
                    } catch (e: Exception) {

                        call.respond(HttpStatusCode.ServiceUnavailable) //бд нету

                    }
                }

                post("/api/assign_resources") {
                    val attacher = call.receive<Attacher>()

                    try {
                        val applicationId = attacher.applicationId

                        applicationsService.setApplicationStatus(applicationId, Status.IN_WORK)
                        for (resourceId in attacher.resourceIds) {
                            val resourceAttached =
                                applicationsService.addResourceToApplication(applicationId, resourceId)
                            val applicationAttached =
                                resourcesService.addApplicationToResource(resourceId, applicationId)

                            resourcesService.setResourceStatus(resourceId, ResourceStatus.IN_WORK)

                            if (!resourceAttached or !applicationAttached)
                                throw NotFoundException()

                            var tg = resourcesService.getResource(resourceId)?.telegramId

                            bot.sendMessagesToUsersByUsername(tg!!, attacher.message)
                        }

                        call.respond((HttpStatusCode.OK))

                    } catch (notFound: NotFoundException) {

                        call.respond(HttpStatusCode.NotFound) //не найдено

                    } catch (e: Exception) {

                        call.respond(HttpStatusCode.ServiceUnavailable) //бд нету

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
}
