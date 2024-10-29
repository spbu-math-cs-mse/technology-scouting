# Требования
- Java 11

# Реализованный функционал
- Swagger. Используется для связи админ-панели и базы данных. При помощи get-запроса **/api/user-list** можно получить список с историей всех сообщений в виде пары **(telegramId, message)**
- Telegram-бот. На данном этапе поддерживает 3 команды:
**/start** - начать работу с ботом, **/help** - получить справочную информацию об использовании бота, **/enquire msg** - записать сообщение msg в базу данных.
- Тесты

- # database
<code>MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_USERNAME=myuser
MONGODB_PASSWORD=mypassword
MONGODB_DBNAME=users_db</code>
