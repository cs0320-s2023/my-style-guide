package edu.brown.cs.student.main.handlers;

import com.squareup.moshi.JsonDataException;
import edu.brown.cs.student.main.jsonUtils.*;
import edu.brown.cs.student.main.jsonUtils.ColorDescRecords.ColorDescJSON;
import edu.brown.cs.student.main.jsonUtils.ColorDescRecords.Description;
import edu.brown.cs.student.main.jsonUtils.ColorResponseJSON.ColorScheme;
import edu.brown.cs.student.main.proxy.ColorProxy;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import java.util.Random;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.IOException;
import java.util.LinkedHashMap;

/**
 * Handler class for retrieving color schemes from the Color API (insert link.)
 * Users will pass in a set of keywords that may or may not match with available
 * colors from our defined map. Successful responses return a list of colors
 * that will be displayed on the front-end.
 */
public class ColorHandler implements Route {

  private ColorProxy proxy;
  private ColorDescJSON colorDescJSON;

  public ColorHandler() {
    this.proxy = new ColorProxy();
    try {
      JSONReader<ColorDescJSON> jsonReader = new JSONReader<>(ColorDescJSON.class);
      String data = jsonReader.readFromFile("data/colorDescriptions.json");
      this.colorDescJSON = jsonReader.fromJson(data);
    } catch (IOException e) {
      System.out.println("Unable to access JSON: " + e.getMessage());
      System.exit(1);
    }
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    String colorKeyword = request.queryParams("keyword");
    if (colorKeyword.isEmpty()) {
      return new FailureResponse("error_bad_request", "Please enter keyword for color scheme.").serialize();
    }

    String colorQuery = this.getColorFromInput(colorKeyword);
    if (colorQuery == null) {
      return new FailureResponse("error_bad_request", "Try a different keyword for your color!").serialize();
    }
    try {
      return new SuccessResponse(colorQuery).serialize();
    } catch (JsonDataException e) {
      System.out.println("Error message: " + e.getMessage());
      return new FailureResponse("error_bad_request", e.getMessage()).serialize();
    }
  }

  /**
   * Helper method that returns a color relating to the user's input
   *
   * @param colorParam string of color chosen by user
   * @return String of color that best matches what user is looking for
   */
  public String getColorFromInput(String colorParam) {
    List<Description> filteredColors = new ArrayList<>();
    for (Description desc : this.colorDescJSON.descriptions()) {
      if (this.containsWord(desc, colorParam)) {
        filteredColors.add(desc);
      }
    }
    // no descriptive words match
    if (filteredColors.isEmpty()) {
      return null;
    }
    // pick random color
    int randIndex = (int)(Math.random() * filteredColors.size());
    Description targetColor = filteredColors.get(randIndex);
    // access hsl ranges
    double[] h_range = targetColor.criteria().hslVals()[0];
    double[] s_range = targetColor.criteria().hslVals()[1];
    double[] l_range = targetColor.criteria().hslVals()[2];
    // choose random color value
    Random r = new Random();
    double h = (h_range[0] + (h_range[1] - h_range[0]) * r.nextDouble()) / 360.; // decimal form required
    double s = s_range[0] + (s_range[1] - s_range[0]) * r.nextDouble();
    double l = l_range[0] + (l_range[1] - l_range[0]) * r.nextDouble();

    String res = h + "," + s + "," + l;
    return res;
  }

  public boolean containsWord(Description desc, String keyword) {
    if (desc.nouns().contains(keyword)) {
      return true;
    }
    if (desc.meanings().contains(keyword)) {
      return true;
    }
    if (desc.usage().contains(keyword)) {
      return true;
    }
    return false;
  }

  /**
   * Success response for keyword search. Serializes the result ("success") and the search response.
   *
   * @param result success result message
   * @param val search response
   */
  public record SuccessResponse(String result, String val) {
    public SuccessResponse(String val) {
      this("success", val);
    }
    public String serialize() {
      Map<String, Object> responseMap = new LinkedHashMap<>();
      responseMap.put("result", this.result);
      responseMap.put("val", this.val);
      return Serializer.serializeSuccess(responseMap);
    }
  }

  /**
   * Failure response for keyword search. Serializes the error type and the error message.
   *
   * @param result error type
   * @param error_message error message to display
   */
  public record FailureResponse(String result, String error_message) {
    public String serialize() {
      Map<String, Object> responseMap = new LinkedHashMap<>();
      responseMap.put("result", this.result);
      responseMap.put("error_message", this.error_message);
      return Serializer.serializeFailure(responseMap);
    }
  }

}

