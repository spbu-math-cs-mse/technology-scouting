plugins {
    kotlin("jvm") version "1.9.22"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
    maven { url = uri("https://jitpack.io")}
}

dependencies {
    testImplementation("org.jetbrains.kotlin:kotlin-test")
    implementation("io.github.kotlin-telegram-bot.kotlin-telegram-bot:telegram:6.2.0")
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(11)
}