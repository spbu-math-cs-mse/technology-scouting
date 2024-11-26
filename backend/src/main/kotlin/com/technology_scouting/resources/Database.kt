package com.technology_scouting.resources

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.technology_scouting.ApplicationWithId
import com.technology_scouting.ResourceStatus
import com.technology_scouting.ResourceWithId
import com.technology_scouting.Status
import org.bson.Document
import org.bson.types.ObjectId
import org.mindrot.jbcrypt.*
import java.time.LocalDateTime

class DatabaseService {
    private val mongoClient: MongoClient
    val database: MongoDatabase

    init {
        val dbHost = System.getenv("MONGODB_HOST")
        val dbPort = System.getenv("MONGODB_PORT")
        val dbDatabase = System.getenv("MONGODB_DBNAME")
        val connectionString = ConnectionString("mongodb://$dbHost:$dbPort")
        val settings =
            MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .build()
        mongoClient = MongoClients.create(settings)
        database = mongoClient.getDatabase(dbDatabase)
    }

    fun closeConnection() {
        mongoClient.close()
    }
}

object ApplicationFields {
    const val ID = "_id"
    const val DATE = "date"
    const val ORGANIZATION = "organization"
    const val CONTACT_NAME = "contactName"
    const val TELEGRAM_ID = "telegramId"
    const val REQUEST_TEXT = "requestText"
    const val STATUS = "status"
}

object FieldValidator {
    fun validateFields(
        updates: Map<String, Any?>,
        allowedFields: List<String>,
    ): Document {
        val validUpdates = Document()
        for ((key, value) in updates) {
            if (key in allowedFields) {
                validUpdates.append(key, value)
            }
        }
        return validUpdates
    }
}

class ApplicationsService(private val database: MongoDatabase) {
    private val connection: MongoCollection<Document> = database.getCollection("applications")

    private val allowedFields =
        listOf(
            ApplicationFields.ORGANIZATION,
            ApplicationFields.CONTACT_NAME,
            ApplicationFields.TELEGRAM_ID,
            ApplicationFields.REQUEST_TEXT,
            ApplicationFields.STATUS,
        )

    fun addApplication(
        organization: String,
        contactName: String,
        telegramId: String,
        requestText: String,
        status: Status = Status.INCOMING,
    ) {
        val document =
            Document()
                .append(ApplicationFields.DATE, LocalDateTime.now().toString())
                .append(ApplicationFields.ORGANIZATION, organization)
                .append(ApplicationFields.CONTACT_NAME, contactName)
                .append(ApplicationFields.TELEGRAM_ID, telegramId)
                .append(ApplicationFields.REQUEST_TEXT, requestText)
                .append(ApplicationFields.STATUS, status.name)

        connection.insertOne(document)
    }

    fun updateApplication(
        applicationId: String,
        updates: Map<String, Any?>,
    ): Boolean {
        val objectId = ObjectId(applicationId)
        val filter = Document(ApplicationFields.ID, objectId)

        val updateDocument = FieldValidator.validateFields(updates, allowedFields)
        if (updateDocument.isEmpty()) {
            throw IllegalArgumentException("No valid fields provided for update.")
        }

        val update = Document("\$set", updateDocument)
        val updateResult = connection.updateOne(filter, update)
        return updateResult.matchedCount > 0
    }

    fun deleteApplication(applicationId: String): Boolean {
        val objectId = ObjectId(applicationId)
        val filter = Document(ApplicationFields.ID, objectId)
        val deleteResult = connection.deleteOne(filter)
        return deleteResult.deletedCount > 0
    }

    fun getApplication(applicationId: String): ApplicationWithId? {
        val objectId = ObjectId(applicationId)
        val filter = Document(ApplicationFields.ID, objectId)
        val document = connection.find(filter).firstOrNull()
        return document?.toApplicationWithId()
    }

    fun getAllApplications(): List<ApplicationWithId> {
        return connection.find().map { it.toApplicationWithId() }.toList()
    }

    private fun Document.toApplicationWithId(): ApplicationWithId {
        return ApplicationWithId(
            _id = this.getObjectId(ApplicationFields.ID).toHexString(),
            date = this.getString(ApplicationFields.DATE),
            organization = this.getString(ApplicationFields.ORGANIZATION),
            contactName = this.getString(ApplicationFields.CONTACT_NAME),
            telegramId = this.getString(ApplicationFields.TELEGRAM_ID),
            requestText = this.getString(ApplicationFields.REQUEST_TEXT),
            status = Status.valueOf(this.getString(ApplicationFields.STATUS)),
        )
    }
}

object ResourceFields {
    const val ID = "_id"
    const val DATE = "date"
    const val ORGANIZATION = "organization"
    const val CONTACT_NAME = "contactName"
    const val TELEGRAM_ID = "telegramId"
    const val COMPETENCE_FIELD = "competenceField"
    const val DESCRIPTION = "description"
    const val TAGS = "tags"
    const val STATUS = "status"
}

class ResourcesService(private val database: MongoDatabase) {
    private val connection: MongoCollection<Document> = database.getCollection("resources")

    private val allowedFields =
        listOf(
            ResourceFields.ORGANIZATION,
            ResourceFields.CONTACT_NAME,
            ResourceFields.TELEGRAM_ID,
            ResourceFields.COMPETENCE_FIELD,
            ResourceFields.DESCRIPTION,
            ResourceFields.TAGS,
            ResourceFields.STATUS,
        )

    fun addResource(
        organization: String,
        contactName: String,
        telegramId: String,
        competenceField: String,
        description: String,
        tags: List<String>,
        status: ResourceStatus,
    ) {
        val document =
            Document()
                .append(ResourceFields.DATE, LocalDateTime.now().toString())
                .append(ResourceFields.ORGANIZATION, organization)
                .append(ResourceFields.CONTACT_NAME, contactName)
                .append(ResourceFields.TELEGRAM_ID, telegramId)
                .append(ResourceFields.COMPETENCE_FIELD, competenceField)
                .append(ResourceFields.DESCRIPTION, description)
                .append(ResourceFields.TAGS, tags)
                .append(ResourceFields.STATUS, status.name)

        connection.insertOne(document)
    }

    fun updateResource(
        resourceId: String,
        updates: Map<String, Any?>,
    ): Boolean {
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

    fun getResource(resourceId: String): ResourceWithId? {
        val objectId = ObjectId(resourceId)
        val filter = Document(ResourceFields.ID, objectId)
        val document = connection.find(filter).firstOrNull()
        return document?.toResourceWithId()
    }

    fun getAllResources(): List<ResourceWithId> {
        return connection.find().map { it.toResourceWithId() }.toList()
    }

    private fun Document.toResourceWithId(): ResourceWithId {
        return ResourceWithId(
            _id = this.getObjectId(ResourceFields.ID).toHexString(),
            date = this.getString(ResourceFields.DATE),
            organization = this.getString(ResourceFields.ORGANIZATION),
            contactName = this.getString(ResourceFields.CONTACT_NAME),
            telegramId = this.getString(ResourceFields.TELEGRAM_ID),
            competenceField = this.getString(ResourceFields.COMPETENCE_FIELD),
            description = this.getString(ResourceFields.DESCRIPTION),
            tags = this.getList(ResourceFields.TAGS, String::class.java),
            status = ResourceStatus.valueOf(this.getString(ResourceFields.STATUS)),
        )
    }
}

object PasswordHelper {
    fun hashPassword(password: String): String {
        return BCrypt.hashpw(password, BCrypt.gensalt())
    }

    fun verifyPassword(
        password: String,
        hashedPassword: String,
    ): Boolean {
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

    fun addAdmin(
        username: String,
        password: String,
    ) {
        val document =
            Document()
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

    fun verifyAdmin(
        username: String,
        password: String,
    ): Boolean {
        val filter = Document(AdminFields.USERNAME, username)
        val admin = connection.find(filter).firstOrNull()

        return admin?.let {
            val hashedPassword = it.getString(AdminFields.PASSWORD)
            PasswordHelper.verifyPassword(password, hashedPassword)
        } ?: false
    }
}
