package com.creative_mind.services;

import com.creative_mind.model.Idea;
import com.opencsv.CSVWriter;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedList;

@ApplicationScoped
public class IdeaCsvService {

    private String csvFilePath;
    private String fileName;

    public IdeaCsvService createCSVFile(LinkedList<Idea> ideas) {
        try {
            FileWriter fileWriter = new FileWriter(this.csvFilePath);

            CSVWriter csvWriter = new CSVWriter(fileWriter);

            String[] headers = {"ID", "Idea"};

            csvWriter.writeNext(headers);

            for (Idea iterator : ideas) {
                String[] row = {iterator.getId() + "", iterator.getContent()};
                csvWriter.writeNext(row);
            }

            csvWriter.close();

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return this;
    }

    public byte[] getCsvFileBytes() {
        try {
            Path filePath = Paths.get(this.csvFilePath);

            byte[] fileBytes = Files.readAllBytes(filePath);

            // remove-file after getting bytes
            Files.delete(filePath);

            return fileBytes;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String getCsvFilePath() {
        return csvFilePath;
    }

    public IdeaCsvService setCsvFilePath(String csvFileName) {
        this.fileName = csvFileName;

        String CSV_PATH_PREFIX = "data/ideas/csv";
        this.csvFilePath = CSV_PATH_PREFIX + "/" + this.fileName + ".csv";

        return this;
    }

    public String getFileName() {
        return fileName;
    }
}
