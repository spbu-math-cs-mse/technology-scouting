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
    val date: String,
    val organization: String,
    val contact: String,
    val contactLink: String,
    val area: String,
    val description: String,
    val tags: List<String>,
    val resourceTypes: List<String>,
    val status: String
)

@Serializable
data class Request(
    val id: String,
    val date: String,
    val organization: String,
    val contact: String,
    val contactLink: String,
    val description: String,
    val theme: String,
    val status: String
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
