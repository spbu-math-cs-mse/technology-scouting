package com.technologyScouting.resources

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.technologyScouting.ApplicationWithId
import com.technologyScouting.ResourceStatus
import com.technologyScouting.ResourceWithId
import com.technologyScouting.Status
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
            MongoClientSettings
                .builder()
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
    const val ASSOCIATED_RESOURCES = "associatedResources"
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

class ApplicationsService(
    private val database: MongoDatabase,
) {
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
        telegramId: Long,
        requestText: String,
        status: Status = Status.INCOMING,
    ): String? {
        val document =
            Document()
                .append(ApplicationFields.DATE, LocalDateTime.now().toString())
                .append(ApplicationFields.ORGANIZATION, organization)
                .append(ApplicationFields.CONTACT_NAME, contactName)
                .append(ApplicationFields.TELEGRAM_ID, telegramId)
                .append(ApplicationFields.REQUEST_TEXT, requestText)
                .append(ApplicationFields.STATUS, status)
                .append(ApplicationFields.ASSOCIATED_RESOURCES, emptyList<String>())

        val result = connection.insertOne(document)
        return result.insertedId
            ?.asObjectId()
            ?.value
            ?.toHexString()
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

    fun setApplicationStatus(applicationId: String, status: Status): Boolean {
        val updates = mapOf(ApplicationFields.STATUS to status)
        return updateApplication(applicationId, updates)
    }

    fun addResourceToApplication(
        applicationId: String,
        resourceId: String,
    ): Boolean {
        val applicationObjectId = ObjectId(applicationId)
        val applicationFilter = Document(ApplicationFields.ID, applicationObjectId)
        val applicationUpdate = Document("\$addToSet", Document(ApplicationFields.ASSOCIATED_RESOURCES, resourceId))

        val applicationResult = connection.updateOne(applicationFilter, applicationUpdate)
        return applicationResult.matchedCount > 0
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

    fun getTelegramIdsFromApplications(applicationIds: List<String>): List<String> {
        return applicationIds.mapNotNull { applicationId ->
            val objectId = ObjectId(applicationId)
            val filter = Document(ApplicationFields.ID, objectId)
            connection.find(filter).firstOrNull()?.getString(ApplicationFields.TELEGRAM_ID)
        }
    }

    fun getAllApplications(): List<ApplicationWithId> = connection.find().map { it.toApplicationWithId() }.toList()

    private fun Document.toApplicationWithId(): ApplicationWithId =
        ApplicationWithId(
            _id = this.getObjectId(ApplicationFields.ID).toHexString(),
            date = this.getString(ApplicationFields.DATE),
            organization = this.getString(ApplicationFields.ORGANIZATION),
            contactName = this.getString(ApplicationFields.CONTACT_NAME),
            telegramId = this.getLong(ApplicationFields.TELEGRAM_ID),
            requestText = this.getString(ApplicationFields.REQUEST_TEXT),
            status = Status.valueOf(this.getString(ApplicationFields.STATUS)).s,
            associatedResources = this.getList(ApplicationFields.ASSOCIATED_RESOURCES, String::class.java) ?: emptyList(),
        )
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
    const val ASSOCIATED_APPLICATIONS = "associatedApplications"
}

class ResourcesService(
    private val database: MongoDatabase,
) {
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
        telegramId: Long,
        competenceField: String,
        description: String,
        tags: List<String>,
        status: ResourceStatus,
    ): String? {
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
                .append(ResourceFields.ASSOCIATED_APPLICATIONS, emptyList<String>())

        val result = connection.insertOne(document)
        return result.insertedId
            ?.asObjectId()
            ?.value
            ?.toHexString()
    }

    fun addApplicationToResource(
        resourceId: String,
        applicationId: String,
    ): Boolean {
        val resourceObjectId = ObjectId(resourceId)
        val resourceFilter = Document(ResourceFields.ID, resourceObjectId)
        val resourceUpdate = Document("\$addToSet", Document(ResourceFields.ASSOCIATED_APPLICATIONS, applicationId))

        val resourceResult = connection.updateOne(resourceFilter, resourceUpdate)
        return resourceResult.matchedCount > 0
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

    fun setResourceStatus(resourceId: String, status: ResourceStatus): Boolean {
        val updates = mapOf(ResourceFields.STATUS to status)
        return updateResource(resourceId, updates)
    }

    fun deleteResource(resourceId: String): Boolean {
        val objectId = ObjectId(resourceId)
        val filter = Document(ResourceFields.ID, objectId)
        val deleteResult = connection.deleteOne(filter)
        return deleteResult.deletedCount > 0
    }

    fun getTelegramIdsFromResources(resourceObjectIds: List<String>): List<String> {
        return resourceObjectIds.mapNotNull { resourceId ->
            val objectId = ObjectId(resourceId)
            val filter = Document(ResourceFields.ID, objectId)
            connection.find(filter).firstOrNull()?.getString(ResourceFields.TELEGRAM_ID)
        }
    }

    fun getResource(resourceId: String): ResourceWithId? {
        val objectId = ObjectId(resourceId)
        val filter = Document(ResourceFields.ID, objectId)
        val document = connection.find(filter).firstOrNull()
        return document?.toResourceWithId()
    }

    fun getAllResources(): List<ResourceWithId> = connection.find().map { it.toResourceWithId() }.toList()

    private fun Document.toResourceWithId(): ResourceWithId =
        ResourceWithId(
            _id = this.getObjectId(ResourceFields.ID).toHexString(),
            date = this.getString(ResourceFields.DATE),
            organization = this.getString(ResourceFields.ORGANIZATION),
            contactName = this.getString(ResourceFields.CONTACT_NAME),
            telegramId = this.getLong(ResourceFields.TELEGRAM_ID),
            competenceField = this.getString(ResourceFields.COMPETENCE_FIELD),
            description = this.getString(ResourceFields.DESCRIPTION),
            tags = this.getList(ResourceFields.TAGS, String::class.java),
            status = ResourceStatus.valueOf(this.getString(ResourceFields.STATUS)).s,
            associatedApplications = this.getList(ResourceFields.ASSOCIATED_APPLICATIONS, String::class.java),
        )
}

object PasswordHelper {
    fun hashPassword(password: String): String = BCrypt.hashpw(password, BCrypt.gensalt())

    fun verifyPassword(
        password: String,
        hashedPassword: String,
    ): Boolean = BCrypt.checkpw(password, hashedPassword)
}

object AdminFields {
    const val ID = "_id"
    const val USERNAME = "username"
    const val PASSWORD = "password"
}

class AdminAuthService(
    private val database: MongoDatabase,
) {
    private val connection: MongoCollection<Document> = database.getCollection("admins")

    init {
        ensureDefaultAdminExists()
    }

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

    private fun ensureDefaultAdminExists() {
        val defaultUsername = "test"
        val defaultPassword = "12345"

        val filter = Document(AdminFields.USERNAME, defaultUsername)
        val existingAdmin = connection.find(filter).firstOrNull()

        if (existingAdmin == null) {
            addAdmin(defaultUsername, defaultPassword)
        }
    }
}
