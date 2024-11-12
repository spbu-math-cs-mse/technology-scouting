FROM gradle:8.10.1-jdk21

WORKDIR /app
COPY . .
RUN ./gradlew build --no-daemon
CMD ["./gradlew", "run"]