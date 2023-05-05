package edu.brown.cs.student.main.jsonUtils;

import com.squareup.moshi.Json;
import java.util.List;

public class ColorDescRecords {

  public record ColorDescJSON (
    @Json(name = "descriptions") List<Description> descriptions
  ){}

  public record Description(
      @Json(name = "criteria") Criteria criteria,
      @Json(name = "nouns") List<String> nouns,
      @Json(name = "meanings") List<String> meanings,
      @Json(name = "usage") List<String> usage
  ){}

  public record Criteria(
      @Json(name = "hsl") double[][] hslVals
  ){}
}
