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
data class InputApplication(
    val date: String,
    val organization: String,
    val contactName: String,
    val telegramId: Long,
    val requestText: String,
    val status: String,
    val associatedResources: List<String> = emptyList<String>(),
)

@Serializable
data class Application(
    val date: String,
    val organization: String,
    val contactName: String,
    val telegramId: Long,
    val requestText: String,
    val status: Status,
    val associatedResources: List<String>,
)

enum class Status(
    val s: String,
) {
    INCOMING("incoming"),
    RESOURCES_SEARCH("resources search"),
    RESOURCES_ATTACHED("resources attached"),
    IN_WORK("in work"),
    ENDED("ended"),
    DECLINED_BY_SCOUT("declined by scout"),
    DECLINED_BY_CLIENT("declined by client"),
}

@Serializable
data class ApplicationWithId(
    val _id: String,
    val date: String,
    val organization: String,
    val contactName: String,
    val telegramId: Long,
    val requestText: String,
    val status: String,
    val associatedResources: List<String>,
)

@Serializable
data class InputResource(
    val date: String,
    val organization: String,
    val contactName: String,
    val telegramId: Long,
    val competenceField: String,
    val description: String,
    val tags: List<String> = emptyList<String>(),
    val status: String,
    val associatedApplications: List<String> = emptyList<String>(),
)

@Serializable
data class Resource(
    val date: String,
    val organization: String,
    val contactName: String,
    val telegramId: Long,
    val competenceField: String,
    val description: String,
    val tags: List<String>,
    val status: ResourceStatus,
    val associatedApplications: List<String>,
)

enum class ResourceStatus(
    val s: String,
) {
    IN_WORK("in work"),
    AVAILABLE("available"),
}

@Serializable
data class ResourceWithId(
    val _id: String,
    val date: String,
    val organization: String,
    val contactName: String,
    val telegramId: Long,
    val competenceField: String,
    val description: String,
    val tags: List<String>,
    val status: String,
    val associatedApplications: List<String>,
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
    val expiration: Int,
)

@Serializable
data class Attacher(
    val applicationId: String,
    val resourceIds: List<String>,
    val message: String,
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

    configureRouting(bot)
}
