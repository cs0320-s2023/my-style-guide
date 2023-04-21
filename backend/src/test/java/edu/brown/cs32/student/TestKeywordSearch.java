package edu.brown.cs32.student;

import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.handlers.KeywordSearchHandler;
import edu.brown.cs.student.main.handlers.KeywordSearchHandler.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;
import okio.Buffer;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration testing suite.
 */
public class TestKeywordSearch {

  public KeywordSearchHandler handler;

  @BeforeAll
  public static void setup_before_everything() {
    Spark.port(0);
    Logger.getLogger("").setLevel(Level.WARNING);
  }

  /**
   * Starts the Spark server on port 0, for testing purposes.
   */
  @BeforeEach
  public void setup() {
    // Setting up the handler for the GET /order endpoint
    handler = new KeywordSearchHandler();
    Spark.get("kwsearch", handler);
    Spark.init();
    Spark.awaitInitialization();
  }

  /**
   * Gracefully stop the Spark server.
   */
  @AfterEach
  public void teardown() {
    // Gracefully stop Spark listening on both endpoints
    Spark.unmap("kwsearch");
    Spark.awaitStop(); // don't proceed until the server is stopped
  }
  /**
   * Method to open API connection and return server response
   *
   * @param url string containing API keyword(s) and user inputs
   * @return Response (success or failure) retrieved from server
   * @throws IOException if the connection fails
   */
  static private <T> T makeAPICall(String url, Class<T> responseType) throws IOException {
    URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + url);
    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
    clientConnection.connect();
    Moshi moshi = new Moshi.Builder().build();
    T response = moshi.adapter(responseType).fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
    clientConnection.disconnect();
    return response;
  }

  // ------ INTEGRATION TESTS ------

  /**
   * Tests server call to keyword search with missing parameter
   * @throws IOException
   */
  @Test
  public void missingParam() throws IOException {
    KeywordFailureResponse response = makeAPICall("kwsearch?keyword=", KeywordFailureResponse.class);
    assertNotNull(response);
    assertEquals("error_bad_request", response.result());
    assertEquals("Error: missing keyword input", response.error_message());
  }

  /**
   * Tests server call to keyword search with keyword that is not found within the full GeoJSON
   * @throws IOException
   */
  @Test
  public void keywordNotFound() throws IOException {
    String keyword = "Jupiter";
    KeywordFailureResponse response = makeAPICall("kwsearch?keyword=" + keyword, KeywordFailureResponse.class);
    assertNotNull(response);
    assertEquals("error_bad_request", response.result());
    assertEquals("Error: keyword not found in descriptions", response.error_message());
  }

  /**
   * Tests server call to keyword search that exists within the full GeoJSON
   * @throws IOException
   */
  @Test
  public void keywordFound() throws IOException {
    String keyword = "Boston";
    KeywordSuccessResponse response = makeAPICall("kwsearch?keyword=" + keyword, KeywordSuccessResponse.class);
    assertNotNull(response);
    assertEquals("success", response.result());
    assertEquals(1, this.handler.getSearchHistory().size());
  }

}