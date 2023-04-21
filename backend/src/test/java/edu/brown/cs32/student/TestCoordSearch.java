package edu.brown.cs32.student;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.handlers.CoordSearchHandler;
import edu.brown.cs.student.main.handlers.CoordSearchHandler.*;
import edu.brown.cs.student.main.jsonUtils.GeoJSONResponse.Feature;
import java.util.List;
import java.util.Random;
import okio.Buffer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;
public class TestCoordSearch {

  // ------ SET UP METHODS ------

  /**
   * The following three methods will set up the port for integration testing
   * with a server that accesses CoordSearchHandler
   */
  @BeforeAll
  public static void initial_setup() {
    Spark.port(0);
    Logger.getLogger("").setLevel(Level.WARNING);
  }

  @BeforeEach
  public void setup() {
    Spark.get("cosearch", new CoordSearchHandler());
    Spark.init();
    Spark.awaitInitialization();
  }

  @AfterEach
  public void teardown() {
    Spark.unmap("cosearch");
    Spark.awaitStop();
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
   * Tests server call to coordinate search query with a missing parameter
   * @throws IOException
   */
  @Test
  public void missingParams() throws IOException {
    CoordSearchHandler.MapFailureResponse response = makeAPICall("cosearch?minLat=40&maxLat=42&minLon=&maxLon=", CoordSearchHandler.MapFailureResponse.class);
    assertNotNull(response);
    assertEquals("error_bad_request", response.result());
    assertEquals("Error: All inputs must be integers.", response.error_message());
  }

  /**
   * Tests server call to coordinate search query with invalid parameters
   * - params are outside of scope [-90,90] and [-180,180]
   * @throws IOException
   */
  @Test
  public void outOfBoundsParams() throws IOException {
    CoordSearchHandler.MapFailureResponse response = makeAPICall("cosearch?minLat=0&maxLat=100&minLon=-60&maxLon=60", CoordSearchHandler.MapFailureResponse.class);
    assertNotNull(response);
    assertEquals("error_bad_request", response.result());
    assertEquals("Error: One or more inputs are out of bounds. Ranges: Lat [-90,90]; Lon [-180,180]", response.error_message());
  }

  /**
   * Tests server call to coordinate search query with invalid parameters
   * - params for min and max are not in ascending order
   * @throws IOException
   */
  @Test
  public void minExceedsMaxParams() throws IOException {
    CoordSearchHandler.MapFailureResponse response = makeAPICall("cosearch?minLat=35&maxLat=30&minLon=-100&maxLon=-95", CoordSearchHandler.MapFailureResponse.class);
    assertNotNull(response);
    assertEquals("error_bad_request", response.result());
    assertEquals("Error: Minimum inputs must not exceed maximum inputs.", response.error_message());
  }

  /**
   * Tests server call to coordinate search query with valid parameters
   * - in addition, these parameters are within U.S. borders
   * @throws IOException
   */
  @Test
  public void standardSearch() throws IOException {
    double minLat = 40;
    double maxLat = 42;
    double minLon = -72;
    double maxLon = -70;

    MapSuccessResponse response = makeAPICall(
        "cosearch?minLat=" + minLat + "&maxLat=" + maxLat + "&minLon=" + minLon + "&maxLon=" + maxLon,
        MapSuccessResponse.class);
    assertEquals("success", response.result());
  }

  // ------ UNIT TESTS ------

  /**
   * Performs fuzz-testing for randomly generated doubles within valid coordinate ranges
   * @throws IOException
   */
  @Test
  public void boundingBoxFuzzTest() throws IOException {
    Random rd = new Random();
    for (int i = 0; i < 50; i++) {
      double minLat = rd.nextDouble(-90, 90);
      double maxLat = rd.nextDouble(-90, 90);
      double minLon = rd.nextDouble(-180, 180);
      double maxLon = rd.nextDouble(-180, 180);

      CoordSearchHandler testHandler = new CoordSearchHandler();
      List<Feature> testFeats = testHandler.getFilteredFeatures(minLat, maxLat, minLon, maxLon);
      assertNotNull(testFeats);
      assertTrue(this.verifyInBounds(testFeats, minLat, maxLat, minLon, maxLon));
    }
  }


  /* Helper method to verify if fuzz tests produce features within the expected bounding box */
  private boolean verifyInBounds(List<Feature> feats, double minLat, double maxLat, double minLon, double maxLon) {
    boolean isInBounds = true;
    for (Feature feat: feats) {
      double[][] coords = feat.geometry().coords()[0][0];
      for (double[] coord : coords) {
        double lon = coord[0];
        double lat = coord[1];
        if (!(lat > minLat && lat < maxLat && lon > minLon && lon < maxLon)) {
          isInBounds = false;
        }
      }
    }
    return isInBounds;
  }
}

