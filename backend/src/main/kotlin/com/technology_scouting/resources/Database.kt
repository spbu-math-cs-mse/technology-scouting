package com.technology_scouting.resources

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import org.bson.Document
import org.bson.types.ObjectId
import java.time.LocalDateTime

class DatabaseService {
    private val mongoClient: MongoClient
    val database: MongoDatabase

    init {
        val dbHost = System.getenv("MONGODB_HOST")
        val dbPort = System.getenv("MONGODB_PORT")
        val dbUser = System.getenv("MONGODB_USERNAME")
        val dbPassword = System.getenv("MONGODB_PASSWORD")
        val dbDatabase = System.getenv("MONGODB_DBNAME")

        val connectionString = ConnectionString("mongodb://$dbHost:$dbPort")
        val settings = MongoClientSettings.builder()
            .applyConnectionString(connectionString)
            .build()
        mongoClient = MongoClients.create(settings)
        database = mongoClient.getDatabase(dbDatabase)
    }

    fun closeConnection() {
        mongoClient.close()
    }
}

data class Resource(
    val tgId: String,
    val resourceName: String?,
    val resourceDescription: String?,
    val resourceType: String?,
    val availableQuantity: Int = 1
)

data class Request(
    val tgId: String,
    val requestDate: LocalDateTime?,
    val requestType: String?,
    val requestDescription: String?
)

class RequestsService(private val database: MongoDatabase) {
    private val connection: MongoCollection<Document> = database.getCollection("requests");

    fun addRequest(
        tgId: String,
        requestDate: LocalDateTime?,
        requestType: String?,
        requestDescription: String?
    ) {
        addRequest(
            Document("tg_id", tgId).append("request_date", requestDate)
                .append("request_type", requestType).append("request_description", requestDescription)
        )
    }

    fun addRequest(document: Document) {
        connection.insertOne(document)
    }
    fun deleteRequest(requestId: String): Boolean {
        val objectId = ObjectId(requestId)
        val filter = Document("_id", objectId)
        val deleteRequest = connection.deleteOne(filter)
        return deleteRequest.deletedCount > 0
    }

    fun getRequest(requestId: String): Document? {
        val objectId = ObjectId(requestId)
        val filter = Document("_id", objectId)
        return connection.find(filter).firstOrNull()
    }

    fun addRequest(request: Request) {
        val document = Document("tg_id", request.tgId)
            .append("request_date", request.requestDate)
            .append("request_type", request.requestType)
            .append("request_description", request.requestDescription)

        connection.insertOne(document)
    }
};

class ResourcesService(private val database: MongoDatabase) {
    private val connection = database.getCollection("resources")

    fun addResource(
        tgId: String,
        resourceName: String?,
        resourceDescription: String?,
        resourceType: String?,
        availableQuantity: Int = 1
    ) {
        addResource(
            Document("tg_id", tgId).append("resource_name", resourceName)
                .append("resource_description", resourceDescription).append("resource_type", resourceType)
                .append("available_quantity", availableQuantity)
        )
    }

    fun addResource(document: Document) {
        connection.insertOne(document)
    }

    fun deleteResource(resourceId: String): Boolean {
        val objectId = ObjectId(resourceId)
        val filter = Document("_id", objectId)
        val deleteResource = connection.deleteOne(filter)
        return deleteResource.deletedCount > 0
    }

    fun getResource(resourceId: String): Document? {
        val objectId = ObjectId(resourceId)
        val filter = Document("_id", objectId)
        return connection.find(filter).firstOrNull()
    }
    fun getAllResources(): List<Resource> {
        return connection.find().map { document ->
            Resource(
                tgId = document.getString("tg_id"),
                resourceName = document.getString("resource_name"),
                resourceDescription = document.getString("resource_description"),
                resourceType = document.getString("resource_type"),
                availableQuantity = document.getInteger("available_quantity", 1)
            )
        }.toList()
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
