package edu.brown.cs.student.main.jsonUtils;
import com.squareup.moshi.Json;
import java.util.List;

public class ColorResponseJSON {
  public record ColorId(
      @Json(name = "hex") Hex hexVals,
      @Json(name = "rgb") RGB rgbVals,
      @Json(name = "name") Name nameVals,
      @Json(name = "image") SVG svgs

  ){}

  public record Hex(
      @Json(name = "value") String value, // format: #______
      @Json(name = "clean") String clean
  ){}

  public record RGB(
      @Json(name = "r") String red,
      @Json(name = "g") String green,
      @Json(name = "b") String blue,
      @Json(name = "value") String value // format: rgb('red' ,'green', 'blue')
  ){}

  public record Name(
      @Json(name = "value") String value, // name of color
      @Json(name = "closest_named_hex") String closestNamedHex,
      @Json(name = "exact_match_name") boolean isExactName,
      @Json(name = "distance") int distance
  ){}

  public record SVG(
      @Json(name = "bare") String bareSVG,
      @Json(name = "named") String namedSVG
  ){}

  public record ColorScheme(
      @Json(name = "mode") String mode,
      @Json(name = "count") String count,
      @Json(name = "colors") List<ColorId> colorList,
      @Json(name = "seed") ColorId seed
  ){}
}
