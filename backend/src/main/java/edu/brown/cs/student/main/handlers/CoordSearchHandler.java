package edu.brown.cs.student.main.handlers;

import com.squareup.moshi.JsonDataException;
import edu.brown.cs.student.main.jsonUtils.*;
import edu.brown.cs.student.main.jsonUtils.GeoJSONResponse.Feature;
import edu.brown.cs.student.main.jsonUtils.GeoJSONResponse.GeoJSON;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Handler class for retrieving filtered map based on a custom coordinate bounding box.
 * Users will pass in four coordinate boundaries to filter the overlay display for
 * the Redlining Data map (see fullDownload.js).
 */
public class CoordSearchHandler implements Route {

  public static final double LatLower = -90.0;
  public static final double LatUpper = 90.0;
  public static final double LonLower = -180.0;
  public static final double LonUpper = 180.0;
  public GeoJSON fullJson;

  public CoordSearchHandler() {
    try {
      JSONReader<GeoJSON> jsonReader = new JSONReader<>(GeoJSON.class);
      String data = jsonReader.readFromFile("data/fullDownload.json");
      this.fullJson = jsonReader.fromJson(data);
    } catch (IOException e) {
      System.out.println("Unable to access GeoJSON redlining data: " + e.getMessage());
      System.exit(1);
    }
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    String minLatParam = request.queryParams("minLat");
    String maxLatParam = request.queryParams("maxLat");
    String minLonParam = request.queryParams("minLon");
    String maxLonParam = request.queryParams("maxLon");

    double minLat;
    double maxLat;
    double minLon;
    double maxLon;

    try {
      minLat = Double.parseDouble(minLatParam);
      maxLat = Double.parseDouble(maxLatParam);
      minLon = Double.parseDouble(minLonParam);
      maxLon = Double.parseDouble(maxLonParam);
    } catch (NumberFormatException e) {
      return new MapFailureResponse("error_bad_request", "Error: All inputs must be integers.").serialize();
    }

    if (!(paramsInBounds(minLat, maxLat, minLon, maxLon))) {
      return new MapFailureResponse("error_bad_request", "Error: One or more inputs are out of bounds. Ranges: Lat [-90,90]; Lon [-180,180]").serialize();
    }
    if ((minLat > maxLat) || (minLon > maxLon)) {
      return new MapFailureResponse("error_bad_request", "Error: Minimum inputs must not exceed maximum inputs.").serialize();
    }

    try {
      List<Feature> filteredFeatures = getFilteredFeatures(minLat, maxLat, minLon, maxLon);
      GeoJSON filteredResult = new GeoJSON(this.fullJson.type(), filteredFeatures);

      return new MapSuccessResponse(filteredResult).serialize();

    } catch (JsonDataException e) {
      System.out.println("Error message: " + e.getMessage());
      return new MapFailureResponse("error_bad_request", e.getMessage()).serialize();
    }
  }

  /**
   * Helper method that verifies if user input coordinates are within a reasonable scope
   *
   * @param minLat minimum Latitude bound
   * @param maxLat maximum Latitide bound
   * @param minLon minimum Longitude bound
   * @param maxLon maximum Longitude bound
   * @return boolean stating if params are within bounds
   */
  private boolean paramsInBounds(double minLat, double maxLat, double minLon, double maxLon) {
    if (minLat < LatLower || minLat > LatUpper) return false;
    if (maxLat < LatLower || maxLat > LatUpper) return false;
    if (minLon < LonLower || minLon > LonUpper) return false;
    if (maxLon < LonLower || maxLon > LonUpper) return false;
    return true;
  }

  /**
   * Extracts features from the full redlining GeoJSON based on a bounding box that
   * is defined by user input coordinate ranges
   *
   * @param minLat minimum Latitude bound
   * @param maxLat maximum Latitide bound
   * @param minLon minimum Longitude bound
   * @param maxLon maximum Longitude bound
   * @return list of features extracted from the full GeoJSON data
   */
  public List<Feature> getFilteredFeatures(double minLat, double maxLat, double minLon, double maxLon) {
    List<Feature> filteredFeatList = new ArrayList<>();
    for (Feature feat: this.fullJson.features()) {
      if (checkFeatInBounds(feat, minLat, maxLat, minLon, maxLon)) {
        filteredFeatList.add(feat);
      }
    }
    return filteredFeatList;
  }

  /**
   * Helper method that verifies if feature is contained within user-defined boundaries
   *
   * @param feat individual feature from GeoJSON
   * @param minLat minimum Latitude bound
   * @param maxLat maximum Latitide bound
   * @param minLon minimum Longitude bound
   * @param maxLon maximum Longitude bound
   * @return boolean stating if feature exists within user boundaries
   */
  private boolean checkFeatInBounds(Feature feat, double minLat, double maxLat, double minLon, double maxLon) {
    try {
      double[][] coords = feat.geometry().coords()[0][0];
      for (double[] coord : coords) {
        double lon = coord[0];
        double lat = coord[1];
        if (!(lat > minLat && lat < maxLat && lon > minLon && lon < maxLon)) {
          return false;
        }
      }
    } catch (NullPointerException e) {
      return false;
    }
    return true;
  }

  /**
   * Success response for keyword search. Serializes the result ("success") and the search response.
   *
   * @param result success result message
   * @param geoJson search response
   */
  public record MapSuccessResponse(String result, GeoJSON geoJson) {
    public MapSuccessResponse(GeoJSON geoJson) {
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
  public record MapFailureResponse(String result, String error_message) {
    public String serialize() {
      Map<String, Object> responseMap = new LinkedHashMap<>();
      responseMap.put("result", this.result);
      responseMap.put("error_message", this.error_message);
      return Serializer.serializeFailure(responseMap);
    }
  }

}
