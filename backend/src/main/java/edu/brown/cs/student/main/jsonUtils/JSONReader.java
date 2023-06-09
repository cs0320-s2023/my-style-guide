package edu.brown.cs.student.main.jsonUtils;
import com.squareup.moshi.*;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

public class JSONReader<T> {
    private final Class<T> type;

    public JSONReader(Class<T> jsonType) throws IOException {
        this.type = jsonType;
    }

    public String readFromFile(String path) throws IOException {
        StringBuilder builder = new StringBuilder();
        try {
            Reader reader = new FileReader(path, StandardCharsets.UTF_8);
            BufferedReader br = new BufferedReader(reader);
            String line;
            while ((line = br.readLine()) != null) {
                builder.append(line);
            }
            br.close();
        } catch (IOException e) {
            throw new IOException("Could not open file at '" + path + "'.");
        }
        return builder.toString();
    }

    public T fromJson(String jsonString) throws IOException, JsonDataException {
        Moshi moshi = new Moshi.Builder().build();
        return moshi.adapter(this.type).fromJson(jsonString);
    }
}