package com.technology_scouting.resources

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import io.github.cdimascio.dotenv.Dotenv
import org.bson.Document

class DatabaseService {
    private val dotenv = Dotenv.load()
    private val mongoClient: MongoClient
    val database: MongoDatabase
    init {
        val dbHost = dotenv["MONGODB_HOST"]
        val dbPort = dotenv["MONGODB_PORT"]
        val dbUser = dotenv["MONGODB_USERNAME"]
        val dbPassword = dotenv["MONGODB_PASSWORD"]
        val dbDatabase = dotenv["MONGODB_DBNAME"]

        val connectionString = ConnectionString(
            "mongodb://$dbUser:$dbPassword@$dbHost:$dbPort/$dbDatabase?authSource=admin&directConnection=true"
        )
        val settings = MongoClientSettings.builder()
            .applyConnectionString(connectionString)
            .build()
        mongoClient = MongoClients.create(settings)

        //database = mongoClient.getDatabase("default_db")
        database = mongoClient.getDatabase(dbDatabase)
    }

    fun closeConnection() {
        mongoClient.close()
    }
}

class UserService(private val database: MongoDatabase) {
    private val collection: MongoCollection<Document> = database.getCollection("users")

    fun addUserRecord(telegram: String, message: String): Boolean {
        val document = Document("tg_id", telegram).append("message", message)
        return try {
            collection.insertOne(document)
            true
        } catch (e: Exception) {
            println("Error adding user record: ${e.message}")
            false
        }
    }

    fun getUserRecords(): List<Pair<String, String>> {
        return collection.find().map { Pair(it.getString("tg_id"), it.getString("message")) }.toList()
    }
}