FROM gradle:8.10.1-jdk21 AS build

WORKDIR /app
COPY . .
RUN ./gradlew build --no-daemon

FROM openjdk:21-jdk
COPY --from=build /app/build/libs/*.jar /app/
CMD ["/bin/bash"]
# CMD ["java", "-jar", "/app/com.example.ktor-rest-task-app-all.jar"]