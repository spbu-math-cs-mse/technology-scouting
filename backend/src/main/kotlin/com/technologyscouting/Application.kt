package com.technologyscouting

import com.technologyscouting.plugins.*
import io.ktor.server.application.*
import kotlinx.serialization.Serializable

@Serializable
data class Item(val telegramId: String, val message: String?)

@Serializable
data class History(val messages: MutableList<Item>)

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureRouting()
}
