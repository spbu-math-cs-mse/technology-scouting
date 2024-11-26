package com.technology_scouting

import com.technology_scouting.plugins.*
import com.technology_scouting.resources.CreateBot
import io.ktor.server.application.*
import io.ktor.server.application.Application
import kotlinx.serialization.Serializable

@Serializable
data class Id(
    val _id: String,
)

@Serializable
data class Application(
    val date: String,
    val organization: String,
    val contactName: String,
    val telegramId: String,
    val requestText: String,
    val status: Status,
)

enum class Status {
    INCOMING,
    RESOURCES_SEARCH,
    RESOURCES_ATTACHED,
    IN_WORK,
    ENDED,
    DECLINED_BY_SCOUT,
    DECLINED_BY_CLIENT,
}

@Serializable
data class ApplicationWithId(
    val _id: String,
    val date: String,
    val organization: String,
    val contactName: String,
    val telegramId: String,
    val requestText: String,
    val status: Status,
)

@Serializable
data class Resource(
    val _id: String,
    val date: String,
    val organization: String,
    val contactName: String,
    val telegramId: String,
    val competenceField: String,
    val description: String,
    val tags: List<String>,
    val status: ResourceStatus,
)

enum class ResourceStatus {
    IN_WORK,
    AVAILABLE,
}

@Serializable
data class ResourceWithId(
    val _id: String, // from Id
    val date: String,
    val organization: String,
    val contactName: String,
    val telegramId: String,
    val competenceField: String,
    val description: String,
    val tags: List<String>,
    val status: ResourceStatus,
)

@Serializable
data class Resources(val resources: List<ResourceWithId>)

@Serializable
data class Applications(val applications: List<ApplicationWithId>)
// @Serializable
// data class Requests(val requests: List<Request>)

@Serializable
data class UnauthorizedError(
    val description: String = "Access token is missing or invalid",
)

@Serializable
data class logIn(
    val login: String,
    val password: String,
)

@Serializable
data class token(
    val token: String,
)

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    val bot = CreateBot()
    bot.startPolling()

    configureRouting()
}
