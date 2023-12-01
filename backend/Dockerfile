# Use the official Quarkus base image for native execution
FROM quay.io/quarkus/ubi-quarkus-native-image:21.3.0-java11 AS builder

# Copy the JAR file from the build directory to the container directory
COPY backend/target/*-runner /work/application

# Set the working directory to /work
WORKDIR /work

# Perform the native image build
RUN chmod 775 /work/application
RUN ./application -H=Xmx384m -H=Xms384m -H:MaxMetaspaceSize=96m -H:MetaspaceSize=96m -H:NativeLinkerOption=-O1

# Use a minimal base image for the final native image
FROM registry.access.redhat.com/ubi8/ubi-minimal:8.4

# Copy the native image from the builder image
COPY --from=builder /work/application /work/application

# Set the command to run the native image
CMD ["./application", "-Dquarkus.http.host=0.0.0.0"]

EXPOSE 8080
