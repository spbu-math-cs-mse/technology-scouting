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
    val _id: String,
    val tg_id: String,
    val resource_name: String?,
    val resource_description: String?,
    val resource_type: String?,
    val available_quantity: Int = 1
)
@Serializable
data class Request(
    val _id: String,
    val tg_id: String,
    val request_type: String?,
    val request_description: String?,
    val status_id: String?
)
@Serializable
data class Resources(val resources: List<Resource>)
@Serializable
data class Requests(val requests: List<Request>)

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureRouting()
}
