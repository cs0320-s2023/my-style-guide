package edu.brown.cs.student.main.proxy;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;

public class ColorProxy {

  /**
   * Makes a call to the Color API by connecting to the URL and returns the corresponding response
   * to access information from a formatted JSON file
   *
   * @param url URL of Color API endpoint
   * @param classType class of record type to convert to
   * @param <T> the record type to convert to
   * @return the resulting APIRecord of type defined by target class
   * @throws IOException if an error occurs while making the API call
   */
  public <T> T callAPI(String url, Class<T> classType) throws IOException {
    URL endpoint = new URL(url);
    HttpURLConnection clientConnection = (HttpURLConnection) endpoint.openConnection();

    clientConnection.connect();
    int status = clientConnection.getResponseCode();

    if (status == 500) {
      throw new IOException("IOException occurred, failed to connect to the Color API.");
    }

    InputStreamReader resultReader = new InputStreamReader(clientConnection.getInputStream());
    String jsonAsString = this.readerToString(resultReader);
    clientConnection.disconnect();

    return this.fromJson(classType, jsonAsString);
  }

  /**
   * Converts a Reader object to a String.
   *
   * @param reader the Reader object to be converted
   * @return String output retrieved from 'reader'
   * @throws IOException if an error occurs while converting Reader object to String
   */
  public String readerToString(Reader reader) throws IOException {
    BufferedReader br = new BufferedReader(reader);
    StringBuilder builder = new StringBuilder();

    String line;
    while ((line = br.readLine()) != null) {
      builder.append(line);
    }
    br.close();

    return builder.toString();
  }

  /**
   * Reads information from JSON files to create Records of type T
   *
   * @param classType class of (record) type to convert into
   * @param jsonString string to read JSON
   * @param <T> record type to be returned
   * @return record type (generic T is used) to retrieve from JSON
   * @throws IOException if Moshi throws an error
   */
  public <T> T fromJson(Type classType, String jsonString) throws IOException {
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<T> adapter = moshi.adapter(classType);
    return adapter.fromJson(jsonString);
  }
}
