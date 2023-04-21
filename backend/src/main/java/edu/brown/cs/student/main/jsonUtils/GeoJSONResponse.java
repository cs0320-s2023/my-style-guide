package edu.brown.cs.student.main.jsonUtils;
import com.squareup.moshi.Json;
import java.util.List;
import java.util.Map;
public class GeoJSONResponse {
  public record GeoJSON(
      @Json(name = "type") String type,
      @Json(name = "features") List<Feature> features
  ){}

  public record Feature(
      @Json(name = "type") String type,
      @Json(name = "geometry") Geometry geometry,
      @Json(name = "properties") Props properties
  ){}

  public record Geometry(
      @Json(name = "type") String type,
      @Json(name = "coordinates") double[][][][] coords
  ){}

  public record Props(
      @Json(name = "state") String state,
      @Json(name = "city") String city,
      @Json(name = "name") String name,
      @Json(name = "holc_id") String holcId,
      @Json(name = "holc_grade") String holcGrade,
      @Json(name = "neighborhood_id") int neighborhood,
      @Json(name = "area_description_data") Map<String, String> areaDesc
  ){}
}
