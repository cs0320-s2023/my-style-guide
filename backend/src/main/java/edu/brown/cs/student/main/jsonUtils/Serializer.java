package edu.brown.cs.student.main.jsonUtils;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;

import java.util.Map;

/**
 * a helper class for JSON serializing
 */
public class Serializer {
  /**
   * serializes a success response to a JSON string using the Moshi library
   * @param responses - map of response objects/data
   * @return JSON string representing the response
   */
  public static String serializeSuccess(Map<String, Object> responses) {
    try {
      Moshi moshi = new Moshi.Builder().build();
      JsonAdapter<Map<String, Object>> jsonAdapter = moshi.adapter(
            Types.newParameterizedType(Map.class, String.class, Object.class));
      return jsonAdapter.toJson(responses);
    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }
  }

  /**
   * serializes a failure response to a JSON string using the Moshi library
   * @param responses - map of response objects/data
   * @return JSON string representing the response
   */
  public static String serializeFailure(Map<String, Object> responses) {
    Moshi moshi = new Moshi.Builder().build();
    return moshi.adapter(Map.class).toJson(responses);
  }
}

