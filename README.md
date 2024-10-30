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

## 🐳 Развертывание приложения

### Предварительные требования
- Docker
- Docker Compose
- Git

### Шаги по развертыванию

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-repo/technology-scouting.git
cd technology-scouting
```

2. Установите следующие переменные окружения:
   - `MONGODB_HOST`, `MONGODB_PORT`, `MONGODB_USERNAME`, `MONGODB_PASSWORD`, `MONGODB_DBNAME` - для подключения к MongoDB
   - `BOT_TOKEN` - для авторизации Telegram бота

   Вы можете установить эти переменные либо через файл `.env` в корневой директории проекта, либо экспортировать их в терминале перед запуском приложения, используя команду `export`.

   Пример файла `.env`:
   ```bash
   MONGODB_HOST=mongodb
   MONGODB_PORT=27017
   MONGODB_USERNAME=myuser
   MONGODB_PASSWORD=mypassword
   MONGODB_DBNAME=users_db
   BOT_TOKEN=your_telegram_bot_token
   ```

3. Соберите и запустите контейнеры:
```bash
docker-compose up --build
```

После успешного запуска:
- Frontend будет доступен по адресу: http://localhost:3000
- Backend API будет доступен по адресу: http://localhost:8080
- Swagger UI будет доступен по адресу: http://localhost:8080/swagger


# Реализованный функционал бекенда
- Swagger. Используется для связи админ-панели и базы данных. При помощи get-запроса **/api/user-list** можно получить список с историей всех сообщений в виде пары **(telegramId, message)**
- Telegram-бот. На данном этапе поддерживает 3 команды:
**/start** - начать работу с ботом, **/help** - получить справочную информацию об использовании бота, **/enquire msg** - записать сообщение msg в базу данных.
- Тесты


## 📝 Release Notes

TODO: уточнить секции, в текущей версии это похоже на список задач, нежели на release notes

### v0.1.0-SNAPSHOT
- [ ] Базовая структура проекта
- [ ] Настройка CI/CD
- [ ] Базовый функционал API
- [ ] Прототип веб-интерфейса
