package com.technologyScouting.plugins

import com.github.kotlintelegrambot.Bot
import com.technologyScouting.*
import com.technologyScouting.resources.ApplicationFields
import com.technologyScouting.resources.ResourceFields
import com.technologyScouting.resources.sendMessagesToUsersByUsername
import io.ktor.http.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.bson.Document
import java.time.Instant
import java.util.*

/**
 * ручка, отвечающая за авторизацию пользователя.
 * при помощи метода VerifyAdmin проверяется корректность логина и пароля
 * при успешной авторизации возвращает объект типа Token
 */
fun Route.loginEndpoint() {
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
}

/**
 * Возвращает список всех хранящихся на данный момент в БД заявок.
 */
fun Route.getApplicationsEndpoint() {
    get("/api/applications") {
        try {
            val applications: List<ApplicationWithId> = applicationsService.getAllApplications()

            call.respond(HttpStatusCode.OK, Applications(applications))
        } catch (e: Exception) {
            call.respond(HttpStatusCode.ServiceUnavailable) // бд сломалась
        }
    }
}

/**
 * возвращает список всех хранящихся на данный момент в БД ресурсов
 */
fun Route.getResourcesEndpoint() {
    get("/api/resources") {
        try {
            val resources: List<ResourceWithId> = resourcesService.getAllResources()

            call.respond(HttpStatusCode.OK, Resources(resources))
        } catch (e: Exception) {
            call.respond(HttpStatusCode.ServiceUnavailable) // бд сломалась
        }
    }
}

/**
 * удаляет заявку с указанным id из бд при помощи метода deleteApplication
 * если такой заявки не было - возвращает код 404
 * если был передан id в неверном формате - возвращает код 400
 * иначе возвращает список всех оставшихся заявок
 */
fun Route.deleteApplicationEndpoint() {
    post("/api/delete_application") {
        val id = call.receive<Id>()

        try {
            val deleted = applicationsService.deleteApplication(id._id)

            if (!deleted) {
                throw NotFoundException()
            }

            val applications: List<ApplicationWithId> = applicationsService.getAllApplications()

            call.respond(HttpStatusCode.OK, Applications(applications))
        } catch (notFound: NotFoundException) {
            call.respond(HttpStatusCode.NotFound) // не найдено
        } catch (invArg: IllegalArgumentException) {
            call.respond(HttpStatusCode.BadRequest) // длина 24
        } catch (e: Exception) {
            call.respond(HttpStatusCode.ServiceUnavailable) // бд нету
        }
    }
}

/**
 *удаляет ресурс с указанным id из бд при помощи метода deleteResource
 * если такой заявки не было - возвращает код 404
 * если был передан id в неверном формате - возвращает код 400
 * иначе возвращает список всех оставшихся ресурсов
 */
fun Route.deleteResourceEndpoint() {
    post("/api/delete_resource") {
        val id = call.receive<Id>()

        try {
            val deleted = resourcesService.deleteResource(id._id)

            if (!deleted) {
                throw NotFoundException()
            }

            val resources: List<ResourceWithId> = resourcesService.getAllResources()

            call.respond(HttpStatusCode.OK, Resources(resources))
        } catch (notFound: NotFoundException) {
            call.respond(HttpStatusCode.NotFound) // не найдено
        } catch (invArg: IllegalArgumentException) {
            call.respond(HttpStatusCode.BadRequest) // длина 24
        } catch (e: Exception) {
            call.respond(HttpStatusCode.ServiceUnavailable) // бд нету
        }
    }
}

/**
 * создает заявку с переданными в объекте InputApplication параметрами
 * и добавляет ее в БД при помощи метода addApplication
 * если были переданы неправильные аргументы - возвращает код 400
 * иначе - возвращает список всех текущих заявок.
 */
fun Route.createApplicationEndpoint() {
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

            call.respond(HttpStatusCode.OK, Applications(applications))
        } catch (invArg: IllegalArgumentException) {
            call.respond(HttpStatusCode.BadRequest) // неверные аргументы
        } catch (invArg: BadRequestException) {
            call.respond(HttpStatusCode.BadRequest) // неверные аргументы
        } catch (e: Exception) {
            call.respond(HttpStatusCode.ServiceUnavailable) // бд нету
        }
    }
}

/**
 * создает ресурс с переданными в объекте InputResource параметрами
 * и добавляет его в БД при помощи метода addResource
 * если были переданы неправильные аргументы - возвращает код 400
 * иначе - возвращает список всех текущих ресурсов.
 */
fun Route.createResourceEndpoint() {
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

            call.respond(HttpStatusCode.OK, Resources(resources))
        } catch (invArg: IllegalArgumentException) {
            println(invArg.toString())
            call.respond(HttpStatusCode.BadRequest) // неверные аргументы
        } catch (invArg: BadRequestException) {
            println(invArg.toString())
            call.respond(HttpStatusCode.BadRequest) // неверные аргументы
        } catch (e: Exception) {
            print(e.toString())
            call.respond(HttpStatusCode.ServiceUnavailable) // бд нету
        }
    }
}

/**
 * изменяет заявку в соответствии с новыми значениями полей, переданными в объекте ApplicationWithId
 * при помощи метода updateApplication
 * Если заявка с таким id не найдена - возвращается код 404
 * если переданные аргументы неверны - возвращается ошибка 400
 * иначе - возвращается список всех заявок
 */
fun Route.updateApplicationEndpoint() {
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
            if (!cnt) {
                throw NotFoundException()
            }

            val applications: List<ApplicationWithId> = applicationsService.getAllApplications()

            call.respond(HttpStatusCode.OK, Applications(applications))
        } catch (notFound: NotFoundException) {
            call.respond(HttpStatusCode.NotFound) // не найдено
        } catch (invArg: IllegalArgumentException) {
            call.respond(HttpStatusCode.BadRequest) // неверные аргументы
        } catch (e: Exception) {
            call.respond(HttpStatusCode.ServiceUnavailable) // бд нету
        }
    }
}

/**
 * изменяет ресурс в соответствии с новыми значениями полей, переданными в объекте ResourceWithId
 * при помощи метода updateResource
 * Если ресурс с таким id не найден - возвращается код 404
 * если переданные аргументы неверны - возвращается ошибка 400
 * иначе - возвращается список всех ресурсов
 */
fun Route.updateResourceEndpoint() {
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
                status =
                    ResourceStatus.valueOf(
                        newResource.status.uppercase(Locale.getDefault()).replace(' ', '_'),
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
            if (!cnt) {
                throw NotFoundException()
            }

            val resources: List<ResourceWithId> = resourcesService.getAllResources()

            call.respond(HttpStatusCode.OK, Resources(resources))
        } catch (notFound: NotFoundException) {
            call.respond(HttpStatusCode.NotFound) // не найдено
        } catch (invArg: IllegalArgumentException) {
            call.respond(HttpStatusCode.BadRequest) // неверные аргументы
        } catch (e: Exception) {
            call.respond(HttpStatusCode.ServiceUnavailable) // бд нету
        }
    }
}

/**
 * данная ручка служит для добавления нового администратора. В объекте NewAdmin передаются его
 * логин и пароль.
 */
fun Route.addNewAdminEndpoint() {
    post("/api/add_new_admin") {
        val newAdmin = call.receive<NewAdmin>()

        try {
            adminAuthService.addAdmin(newAdmin.login, newAdmin.password)

            call.respond((HttpStatusCode.OK))
        } catch (e: Exception) {
            call.respond(HttpStatusCode.ServiceUnavailable) // бд нету
        }
    }
}

/**
 * при помощи данной ручки ресурс прикрепляется к заявке.
 * при помощи метода addResourceToApplication все ресурсы
 * из списка ресурсов, хранящегося в объекте Attacher, помечаются, как прикрепленные к данной заявке
 * при помощи метода addApplicationToResource к данной заявке прикрепляется список с ресурсами.
 * Статус заявки после этого меняется на in_work
 */
fun Route.assignResourcesEndpoint(bot: Bot) {
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

                if (!resourceAttached or !applicationAttached) {
                    throw NotFoundException()
                }

                var tg = resourcesService.getResource(resourceId)?.telegramId

                bot.sendMessagesToUsersByUsername(tg!!, attacher.message)
            }

            val applications: List<ApplicationWithId> = applicationsService.getAllApplications()
            call.respond(HttpStatusCode.OK, Applications(applications))
        } catch (notFound: NotFoundException) {
            call.respond(HttpStatusCode.NotFound) // не найдено
        } catch (e: Exception) {
            call.respond(HttpStatusCode.ServiceUnavailable) // бд нету
        }
    }
}
