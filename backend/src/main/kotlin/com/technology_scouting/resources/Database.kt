package com.technology_scouting.resources
import org.mindrot.jbcrypt.*

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.technology_scouting.Request
import com.technology_scouting.Resource
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
                .append("request_type", requestType).append("request_description", requestDescription).append("status_id", "In review")
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
        val document = Document("tg_id", request.tg_id)
            //.append("request_date", request.requestDate)
            .append("request_type", request.request_type)
            .append("request_description", request.request_description)

        connection.insertOne(document)
    }

    fun getAllRequests(): List<Request> {
        return connection.find().map { document ->
            Request(
                _id = document.getObjectId("_id").toHexString(),
                tg_id = document.getString("tg_id"),
                request_type = document.getString("request_type"),
                request_description = document.getString("request_description"),
                status_id = document.getString("status_id")
            )
        }.toList()
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
                _id = document.getObjectId("_id").toHexString(),
                tg_id = document.getString("tg_id"),
                resource_name = document.getString("resource_name"),
                resource_description = document.getString("resource_description"),
                resource_type = document.getString("resource_type"),
                available_quantity = document.getInteger("available_quantity", 1)
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

object PasswordHasher {
    fun hashPassword(password: String): String {
        return BCrypt.hashpw(password, BCrypt.gensalt())
    }
    fun verifyPassword(password: String, hashedPassword: String): Boolean {
        return BCrypt.checkpw(password, hashedPassword)
    }
}


class AdminAuthService(private val database: MongoDatabase) {
    private val connection: MongoCollection<Document> = database.getCollection("admins")
    fun addAdmin(username: String, password: String) {
        val document = Document("username", username)
            .append("password", PasswordHasher.hashPassword(password))
        connection.insertOne(document)
    };
    fun deleteAdmin(adminId: String): Boolean {
        val objectId = ObjectId(adminId)
        val filter = Document("_id", objectId)
        val deleteAdmin = connection.deleteOne(filter)
        return deleteAdmin.deletedCount > 0
    };
    fun verifyAdmin(username: String, password: String): Boolean {
        val filter = Document("username", username)
        val admin = connection.find(filter).firstOrNull()
        if (admin != null) {
            val hashedPassword = admin.getString("password")
            return PasswordHasher.verifyPassword(password, hashedPassword)
        }
        return false;
    };
}


