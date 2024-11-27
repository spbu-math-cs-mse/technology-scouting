FROM gradle:8.10.1-jdk21

WORKDIR /app

RUN apt-get update && apt-get install -y openjdk-11-jdk

COPY . .

RUN ./gradlew build --no-daemon

CMD ["./gradlew", "run"]
