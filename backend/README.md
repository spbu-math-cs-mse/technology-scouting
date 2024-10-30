# Technology Scouting

Платформа для построения эффективных связей между университетами и бизнесом.

## 🎯 Описание проекта

Technology Scouting - это платформа, направленная на раскрытие потенциала связей университетов с внешним миром. Проект помогает бизнесу находить и использовать научные и технологические ресурсы университетов, а университетам - находить практическое применение своим разработкам.

## 👥 Роли в команде

- Backend-разработчики: Федя и Вова
- Frontend-разработчики: Тима и Катя
- Database-разработчик: Саша
- DevOps: Сева

## 🚀 Планируемые функции

### MVP
- База проектов от бизнеса
  - Информация о проекте (название, описание, стадия)
  - Технологические вертикали
  - Открытые вакансии
  
- База данных компетенций
  - Профили экспертов
  - Связи с университетами
  - Доступные ресурсы
  
- Telegram бот для студентов
  - Публикация вакансий
  - Информация о хакатонах
  - Уведомления о новых возможностях

- Веб-платформа
  - Интерфейс для бизнеса
  - Интерфейс для представителей вузов
  - Интеграция с Telegram ботом

## 🛠 Инструкция по запуску

### Требования
- Java 11
- Node.js 18 или выше
- MongoDB 6.0 или выше

TODO: уточнить версии

### Backend

```
bash
cd backend
./gradlew build
./gradlew run
```

### Frontend

```
bash
cd frontend
npm install
npm run dev
```

# Требования
- Java 11

# Реализованный функционал бекенда
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


## 📝 Release Notes

TODO: уточнить секции, в текущей версии это похоже на список задач, нежели на release notes

### v0.1.0-SNAPSHOT
- [ ] Базовая структура проекта
- [ ] Настройка CI/CD
- [ ] Базовый функционал API
- [ ] Прототип веб-интерфейса