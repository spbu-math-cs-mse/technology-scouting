package com.technologyScouting

import com.technologyScouting.plugins.*
import com.technologyScouting.resources.createBot
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

enum class Status(
    s: String,
) {
    INCOMING("incoming"),
    RESOURCES_SEARCH("resources_search"),
    RESOURCES_ATTACHED("resources_attached"),
    IN_WORK("in_work"),
    ENDED("ended"),
    DECLINED_BY_SCOUT("declined_by_scout"),
    DECLINED_BY_CLIENT("declined_by_client"),
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

enum class ResourceStatus(
    s: String,
) {
    IN_WORK("in_work"),
    AVAILABLE("available"),
}

@Serializable
data class ResourceWithId(
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

@Serializable
data class Resources(
    val resources: List<ResourceWithId>,
)

@Serializable
data class Applications(
    val applications: List<ApplicationWithId>,
)

@Serializable
data class UnauthorizedError(
    val description: String = "Access token is missing or invalid",
)

@Serializable
data class NewAdmin(
    val login: String,
    val password: String,
)

@Serializable
data class LogIn(
    val login: String,
    val password: String,
)

@Serializable
data class Token(
    val token: String,
)

fun main(args: Array<String>) {
    io
        .ktor
        .server
        .netty
        .EngineMain
        .main(args)
}

fun Application.module() {
    val bot = createBot()
    bot.startPolling()

    configureRouting()
}
