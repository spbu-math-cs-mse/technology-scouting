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

object RequestFields {
    const val ID = "_id"
    const val DATE = "date"
    const val ORGANIZATION = "organization"
    const val CONTACT = "contact"
    const val CONTACT_LINK = "contact_link"
    const val REQUEST = "request"
    const val THEME = "theme"
    const val STATUS = "status"
}

object FieldValidator {
    fun validateFields(updates: Map<String, Any?>, allowedFields: List<String>): Document {
        val validUpdates = Document()
        for ((key, value) in updates) {
            if (key in allowedFields) {
                validUpdates.append(key, value)
            }
        }
        return validUpdates
    }
}


class RequestsService(private val database: MongoDatabase) {
    private val connection: MongoCollection<Document> = database.getCollection("requests")

    private val allowedFields = listOf(
        RequestFields.ORGANIZATION,
        RequestFields.CONTACT,
        RequestFields.CONTACT_LINK,
        RequestFields.REQUEST,
        RequestFields.THEME,
        RequestFields.STATUS
    )

    fun addRequest(
        organization: String,
        contact: String,
        contactLink: String,
        description: String,
        theme: String,
        status: String = "In review"
    ) {
        val document = Document()
            .append(RequestFields.DATE, LocalDateTime.now().toString())
            .append(RequestFields.ORGANIZATION, organization)
            .append(RequestFields.CONTACT, contact)
            .append(RequestFields.CONTACT_LINK, contactLink)
            .append(RequestFields.REQUEST, description)
            .append(RequestFields.THEME, theme)
            .append(RequestFields.STATUS, status)

        connection.insertOne(document)
    }

    fun updateRequest(requestId: String, updates: Map<String, Any?>): Boolean {
        val objectId = ObjectId(requestId)
        val filter = Document(RequestFields.ID, objectId)

        val updateDocument = FieldValidator.validateFields(updates, allowedFields)
        if (updateDocument.isEmpty()) {
            throw IllegalArgumentException("No valid fields provided for update.")
        }

        val update = Document("\$set", updateDocument)
        val updateResult = connection.updateOne(filter, update)
        return updateResult.matchedCount > 0
    }

    fun deleteRequest(requestId: String): Boolean {
        val objectId = ObjectId(requestId)
        val filter = Document(RequestFields.ID, objectId)
        val deleteResult = connection.deleteOne(filter)
        return deleteResult.deletedCount > 0
    }

    fun getRequest(requestId: String): Request? {
        val objectId = ObjectId(requestId)
        val filter = Document(RequestFields.ID, objectId)
        val document = connection.find(filter).firstOrNull()
        return document?.toRequest()
    }

    fun getAllRequests(): List<Request> {
        return connection.find().map { it.toRequest() }.toList()
    }

    private fun Document.toRequest(): Request {
        return Request(
            id = this.getObjectId(RequestFields.ID).toHexString(),
            date = this.getString(RequestFields.DATE),
            organization = this.getString(RequestFields.ORGANIZATION),
            contact = this.getString(RequestFields.CONTACT),
            contactLink = this.getString(RequestFields.CONTACT_LINK),
            description = this.getString(RequestFields.REQUEST),
            theme = this.getString(RequestFields.THEME),
            status = this.getString(RequestFields.STATUS)
        )
    }
}

object ResourceFields {
    const val ID = "_id"
    const val DATE = "date"
    const val ORGANIZATION = "organization"
    const val CONTACT = "contact"
    const val CONTACT_LINK = "contact_link"
    const val AREA = "area"
    const val DESCRIPTION = "description"
    const val TAGS = "tags"
    const val RESOURCE_TYPES = "resource_types"
    const val STATUS = "status"
}


class ResourcesService(private val database: MongoDatabase) {
    private val connection: MongoCollection<Document> = database.getCollection("resources")

    private val allowedFields = listOf(
        ResourceFields.ORGANIZATION,
        ResourceFields.CONTACT,
        ResourceFields.CONTACT_LINK,
        ResourceFields.AREA,
        ResourceFields.DESCRIPTION,
        ResourceFields.TAGS,
        ResourceFields.RESOURCE_TYPES,
        ResourceFields.STATUS
    )

    fun addResource(
        date: String,
        organization: String,
        contact: String,
        contactLink: String,
        area: String,
        description: String,
        tags: List<String>,
        resourceTypes: List<String>,
        status: String
    ) {
        val document = Document()
            .append(ResourceFields.DATE, date)
            .append(ResourceFields.ORGANIZATION, organization)
            .append(ResourceFields.CONTACT, contact)
            .append(ResourceFields.CONTACT_LINK, contactLink)
            .append(ResourceFields.AREA, area)
            .append(ResourceFields.DESCRIPTION, description)
            .append(ResourceFields.TAGS, tags)
            .append(ResourceFields.RESOURCE_TYPES, resourceTypes)
            .append(ResourceFields.STATUS, status)

        connection.insertOne(document)
    }

    fun updateResource(resourceId: String, updates: Map<String, Any?>): Boolean {
        val objectId = ObjectId(resourceId)
        val filter = Document(ResourceFields.ID, objectId)
        val updateDocument = FieldValidator.validateFields(updates, allowedFields)
        if (updateDocument.isEmpty()) {
            throw IllegalArgumentException("No valid fields provided for update.")
        }

        val update = Document("\$set", updateDocument)
        val updateResult = connection.updateOne(filter, update)
        return updateResult.matchedCount > 0
    }

    fun deleteResource(resourceId: String): Boolean {
        val objectId = ObjectId(resourceId)
        val filter = Document(ResourceFields.ID, objectId)
        val deleteResult = connection.deleteOne(filter)
        return deleteResult.deletedCount > 0
    }

    fun getResource(resourceId: String): Resource? {
        val objectId = ObjectId(resourceId)
        val filter = Document(ResourceFields.ID, objectId)
        val document = connection.find(filter).firstOrNull()
        return document?.toResource()
    }


    fun getAllResources(): List<Resource> {
        return connection.find().map { it.toResource() }.toList()
    }

    private fun Document.toResource(): Resource {
        return Resource(
            id = this.getObjectId(ResourceFields.ID).toHexString(),
            date = this.getString(ResourceFields.DATE),
            organization = this.getString(ResourceFields.ORGANIZATION),
            contact = this.getString(ResourceFields.CONTACT),
            contactLink = this.getString(ResourceFields.CONTACT_LINK),
            area = this.getString(ResourceFields.AREA),
            description = this.getString(ResourceFields.DESCRIPTION),
            tags = this.getList(ResourceFields.TAGS, String::class.java),
            resourceTypes = this.getList(ResourceFields.RESOURCE_TYPES, String::class.java),
            status = this.getString(ResourceFields.STATUS)
        )
    }
}

object PasswordHelper {
    fun hashPassword(password: String): String {
        return BCrypt.hashpw(password, BCrypt.gensalt())
    }

    fun verifyPassword(password: String, hashedPassword: String): Boolean {
        return BCrypt.checkpw(password, hashedPassword)
    }
}

object AdminFields {
    const val ID = "_id"
    const val USERNAME = "username"
    const val PASSWORD = "password"
}

class AdminAuthService(private val database: MongoDatabase) {
    private val connection: MongoCollection<Document> = database.getCollection("admins")

    fun addAdmin(username: String, password: String) {
        val document = Document()
            .append(AdminFields.USERNAME, username)
            .append(AdminFields.PASSWORD, PasswordHelper.hashPassword(password))
        connection.insertOne(document)
    }

    fun deleteAdmin(adminId: String): Boolean {
        val objectId = ObjectId(adminId)
        val filter = Document(AdminFields.ID, objectId)
        val deleteResult = connection.deleteOne(filter)
        return deleteResult.deletedCount > 0
    }

    fun verifyAdmin(username: String, password: String): Boolean {
        val filter = Document(AdminFields.USERNAME, username)
        val admin = connection.find(filter).firstOrNull()

        return admin?.let {
            val hashedPassword = it.getString(AdminFields.PASSWORD)
            PasswordHelper.verifyPassword(password, hashedPassword)
        } ?: false
    }
}

