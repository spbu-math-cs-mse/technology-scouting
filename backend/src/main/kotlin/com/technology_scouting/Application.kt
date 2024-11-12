package com.technology_scouting

import com.technology_scouting.plugins.*
import io.ktor.server.application.*
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class Id(
    val id: String
)
@Serializable
data class Resource(
    val id: String,
    val tgId: String,
    val resourceName: String?,
    val resourceDescription: String?,
    val resourceType: String?,
    val availableQuantity: Int = 1
)
@Serializable
data class Request(
    val id: String,
    val tgId: String,
    val requestType: String?,
    val requestDescription: String?,
    val statusId: String?
)
@Serializable
data class Resources(val resource: List<Resource>)
@Serializable
data class Requests(val resource: List<Request>)

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureRouting()
}
