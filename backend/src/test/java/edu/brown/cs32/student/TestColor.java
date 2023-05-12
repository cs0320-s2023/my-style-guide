package edu.brown.cs32.student;

import com.squareup.moshi.Json;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.handlers.ColorHandler;
import edu.brown.cs.student.main.jsonUtils.ColorDescRecords.ColorDescJSON;
import edu.brown.cs.student.main.jsonUtils.ColorDescRecords.Description;
import edu.brown.cs.student.main.jsonUtils.ColorResponseJSON.*;
import edu.brown.cs.student.main.jsonUtils.*;
import edu.brown.cs.student.main.proxy.ColorProxy;
import edu.brown.cs32.student.mocks.ColorMocks;

import java.io.IOError;
import java.util.ArrayList;
import java.util.List;
import okio.Buffer;
import org.checkerframework.checker.units.qual.C;
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

import static java.lang.Double.parseDouble;
import static org.junit.jupiter.api.Assertions.*;

public class TestColor {

  // ---------------------- SET UP METHODS ----------------------

  /**
   * The following three methods will set up the port for integration testing
   * with a server that accesses ColorHandler
   */
  @BeforeAll
  public static void initial_setup() {
    Spark.port(0);
    Logger.getLogger("").setLevel(Level.WARNING);
  }

  @BeforeEach
  public void setup() {
    int c = 6;
    Spark.get("color", new ColorHandler());
    Spark.init();
    Spark.awaitInitialization();
  }

  @AfterEach
  public void teardown() {
    Spark.unmap("color");
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

  // ---------------------- UNIT TESTS ----------------------
  @Test
  public void testColorId() throws IOException {
    ColorProxy proxy = new ColorProxy();
    ColorId res = proxy.fromJson(ColorId.class, ColorMocks.COBALT_ID);
    assertEquals("rgb(0, 71, 171)", res.rgbVals().value());
  }

  /**
   * Tests containsWord method by creating mock Description object and testing the returned boolean values
   * @throws IOException
   */
  @Test
  public void testContainsWordSimple() throws IOException {
    ColorDescRecords.Criteria criteria = new ColorDescRecords.Criteria(new double[][]{{0.1, 0.2, 0.3}, {0.4, 0.5, 0.6}});
    List<String> nouns = new ArrayList<>();
    List<String> meanings = new ArrayList<>();
    List<String> usage = new ArrayList<>();
    nouns.add("bold");
    nouns.add("free");
    nouns.add("clean");
    meanings.add("cool");
    meanings.add("weird");
    meanings.add("funny");
    usage.add("movement");
    usage.add("holding");
    usage.add("sit");
    ColorHandler colorHandler = new ColorHandler();
    Description description = new Description(criteria, nouns, meanings, usage);

    // testing each word in each array list
    for (int i = 0; i < nouns.size(); i++) {
      assertTrue(colorHandler.containsWord(description, nouns.get(i)));
    }
    for (int i = 0; i < meanings.size(); i++) {
      assertTrue(colorHandler.containsWord(description, meanings.get(i)));
    }
    for (int i = 0; i < usage.size(); i++) {
      assertTrue(colorHandler.containsWord(description, usage.get(i)));
    }

    // testing words that are not in description object
    assertFalse(colorHandler.containsWord(description, "blue"));
    assertFalse(colorHandler.containsWord(description, "hold"));
    assertFalse(colorHandler.containsWord(description, "move"));

    // edge cases
    assertFalse(colorHandler.containsWord(description, "Cool")); // containing capital
    assertFalse(colorHandler.containsWord(description, "cool1")); // containng int
    assertFalse(colorHandler.containsWord(description, " cool")); // containing space
    assertFalse(colorHandler.containsWord(description, "")); // blank
    assertFalse(colorHandler.containsWord(description, " ")); // just a space

  }


  /**
   * Tests containsWords using a mocked JSON file
   * @throws IOException
   */
  @Test
  public void testContainsWordMockJSON() throws IOException {
    JSONReader<ColorDescJSON> jsonReader = new JSONReader<>(ColorDescJSON.class);
    String data = jsonReader.readFromFile("data/colorDescriptions.json");
    ColorDescJSON json = jsonReader.fromJson(data);
    List<Description> descList = json.descriptions();
    Description desc = descList.get(0);
    ColorHandler colorHandler = new ColorHandler();

    // checking words that are in desc object
    assertTrue(colorHandler.containsWord(desc, "white"));
    assertTrue(colorHandler.containsWord(desc, "purity"));
    assertTrue(colorHandler.containsWord(desc, "health"));

    // edge cases
    assertFalse(colorHandler.containsWord(desc, "")); // no input
    assertFalse(colorHandler.containsWord(desc, "White")); // capital letter
    assertFalse(colorHandler.containsWord(desc, "purity1")); // number


  }

  /**
   * Tests the getColorFromInput method and makes sure it returns a string that when split by "," has 3 different strings
   * @throws IOException
   */
  @Test
  public void testGetColorFromInput() throws IOException {
    ColorHandler colorHandler = new ColorHandler();

    String out1 = colorHandler.getColorFromInput("white");
    String[] decimals1 = out1.split(",");
    assertEquals(decimals1.length, 3);

    String out2 = colorHandler.getColorFromInput("purity");
    String[] decimals2 = out2.split(",");
    assertEquals(decimals2.length, 3);

    String out3 = colorHandler.getColorFromInput("health");
    String[] decimals3 = out3.split(",");
    assertEquals(decimals3.length, 3);


    // the following will return null because the containsWord method is case sensitive
    String out4 = colorHandler.getColorFromInput("White");
    assertEquals(out4, null);

    String out5 = colorHandler.getColorFromInput("white1");
    assertEquals(out4, null);

    String out6 = colorHandler.getColorFromInput("");
    assertEquals(out4, null);


  }



  // ---------------------- INTEGRATION TESTS ----------------------
  /**
   * Tests server call to color search with a missing parameter
   * @throws IOException
   */
  @Test
  public void missingParams() throws IOException {
    ColorHandler.FailureResponse response = makeAPICall("color?keyword=", ColorHandler.FailureResponse.class);
    assertNotNull(response);
    assertEquals("error_bad_request", response.result());
    assertEquals("Please enter keyword for color scheme.", response.error_message());
  }

  /**
   * Tests server call for color search query where color cannot be generated
   * @throws IOException
   */
  @Test
  public void invalidParam() throws IOException {
    ColorHandler.FailureResponse response = makeAPICall("color?keyword=telson", ColorHandler.FailureResponse.class);
    assertNotNull(response);
    assertEquals("error_bad_request", response.result());
    assertEquals("Try a different keyword for your color!", response.error_message());
  }

  /**
   * Tests a valid server call based on a keyword match with the 'nouns' field
   * @throws IOException
   */
  @Test
  public void validNounParam() throws IOException {
    String param = "blue";
    ColorHandler.SuccessResponse response = makeAPICall("color?keyword="+param, ColorHandler.SuccessResponse.class);
    assertEquals("success", response.result());
    assertNotNull(response.val());
    assertTrue(valInExpectedRange(param, response.val()));
  }

  /**
   * Tests a valid server call based on a keyword match with the 'meanings' field
   * @throws IOException
   */
  @Test
  public void validMeaningParam() throws IOException {
    String param = "power";
    ColorHandler.SuccessResponse response = makeAPICall("color?keyword="+param, ColorHandler.SuccessResponse.class);
    assertEquals("success", response.result());
    assertNotNull(response.val());
    assertTrue(valInExpectedRange(param, response.val()));
  }

  /**
   * Tests a valid server call based on a keyword match with the 'usage' field
   * @throws IOException
   */
  @Test
  public void validUsageParam() throws IOException {
    String param = "health";
    ColorHandler.SuccessResponse response = makeAPICall("color?keyword="+param, ColorHandler.SuccessResponse.class);
    assertEquals("success", response.result());
    assertNotNull(response.val());
    assertTrue(valInExpectedRange(param, response.val()));
  }

  /**
   * Helper method to test that the response value from ColorHandler (the HSL color value)
   * is within the expected bounds of the colors found in the colorDescriptions.json file
   * @param param keyword being tested
   * @param val hsl value from ColorHandler success response
   * @return boolean (if val fall within all possible hsl bounds)
   * @throws IOException
   */
  public boolean valInExpectedRange(String param, String val) throws IOException {
    JSONReader<ColorDescJSON> jsonReader = new JSONReader<>(ColorDescJSON.class);
    String data = jsonReader.readFromFile("data/colorDescriptions.json");
    ColorDescJSON json = jsonReader.fromJson(data);

    String[] hsl = val.split(",");
    double h = parseDouble(hsl[0]) * 360.; // accounting for decimal form (see getColorFromInput() in ColorHandler)
    double s = parseDouble(hsl[1]);
    double l = parseDouble(hsl[2]);

    List<Description> filteredColors = new ArrayList<>();
    for (Description desc : json.descriptions()) {
      if (desc.nouns().contains(param) | desc.meanings().contains(param) | desc.usage().contains(param)) {
        filteredColors.add(desc);
      }
    }

    for (Description color : filteredColors) {
      double[] h_range = color.criteria().hslVals()[0];
      double[] s_range = color.criteria().hslVals()[1];
      double[] l_range = color.criteria().hslVals()[2];
      int count = 0;

      if ((h > h_range[0]) & (h < h_range[1])) {
        count += 1;
      }
      if ((s > s_range[0]) & (s < s_range[1])) {
        count += 1;
      }
      if ((l > l_range[0]) & (l < l_range[1])) {
        count += 1;
      }
      if (count == 3) {
        return true;
      }
    }
    return false;
  }
}
