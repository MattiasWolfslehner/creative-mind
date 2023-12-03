FROM openjdk:22-ea-17-jdk-slim-bullseye

WORKDIR /application

COPY target/. .

EXPOSE 8080

CMD ["./creative-mind-backend-1.0-SNAPSHOT-runner", "-Dquarkus.http.host=0.0.0.0"]
