package edu.brown.cs.student.main.handlers;

import com.squareup.moshi.JsonDataException;
import edu.brown.cs.student.main.jsonUtils.GeoJSONResponse.*;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import edu.brown.cs.student.main.jsonUtils.*;

/**
 * Handler class for retrieving filtered map based on description keywords provided by user.
 * These keywords correlate to the area_description_data field within the GeoJSONResponse.
 */
public class KeywordSearchHandler implements Route {
  Map<String, String> searchHistory;

  public KeywordSearchHandler() {
    this.searchHistory = new HashMap<>();
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    String keyword = request.queryParams("keyword");

    if (keyword == null || keyword.equals("")) {
      return new KeywordFailureResponse("error_bad_request", "Error: missing keyword input.").serialize();
    }
    if (searchHistory.containsKey(keyword)) {
      return searchHistory.get(keyword);
    }
    try {
      JSONReader<GeoJSON> jsonReader = new JSONReader<>(GeoJSON.class);
      String data = jsonReader.readFromFile("data/fullDownload.json");
      GeoJSON result = jsonReader.fromJson(data);
      List<Feature> filteredFeatures =  result.features()
          .stream()
          .filter(feature -> {
            // check if the description contains the keyword
            if (feature.properties() != null) return this.containsWord(feature.properties().areaDesc(), keyword);
            else return false;
          })
          .collect(Collectors.toList());

      if (filteredFeatures.size() == 0) {
        return new KeywordFailureResponse("error_bad_request", "Error: keyword '" + keyword + "' not found in GeoJSON area descriptions").serialize();
      }
      GeoJSON filteredResult = new GeoJSON(result.type(), filteredFeatures);
      String successResponse = new KeywordSuccessResponse(filteredResult).serialize();
      this.searchHistory.put(keyword, successResponse);
      return successResponse;
    }
    catch(IOException | JsonDataException e) {
      return new KeywordFailureResponse("error_bad_request", e.getMessage()).serialize();
    }
  }

  /**
   * Helper method that verifies if keyword is found within the map of description words
   *
   * @param descMap Map that returns strings of descriptions
   * @param keyword string (keyword) passed in by user
   * @return boolean stating if keyword is contained in description
   */
  private boolean containsWord(Map<String, String> descMap, String keyword) {
    for (String desc: descMap.values()) {
      List<String> tokens = Arrays.asList(desc.split("[\\p{Punct}\\s]+"));
      if (tokens.contains(keyword)) return true;
    }
    return false;
  }

  /**
   * Success response for keyword search. Serializes the result ("success") and the search response.
   *
   * @param result success result message
   * @param geoJson search response
   */
  public record KeywordSuccessResponse(String result, GeoJSON geoJson) {
    public KeywordSuccessResponse(GeoJSON geoJson) {
      this("success", geoJson);
    }
    public String serialize() {
      Map<String, Object> responseMap = new LinkedHashMap<>();
      responseMap.put("result", this.result);
      responseMap.put("data", this.geoJson);
      return Serializer.serializeSuccess(responseMap);
    }
  }

  /**
   * Failure response for keyword search. Serializes the error type and the error message.
   *
   * @param result error type
   * @param error_message error message to display
   */
  public record KeywordFailureResponse(String result, String error_message) {
    public String serialize() {
      Map<String, Object> responseMap = new LinkedHashMap<>();
      responseMap.put("result", this.result);
      responseMap.put("error_message", this.error_message);
      return Serializer.serializeFailure(responseMap);
    }
  }

  public Map<String, String> getSearchHistory() {
    return searchHistory;
  }
}