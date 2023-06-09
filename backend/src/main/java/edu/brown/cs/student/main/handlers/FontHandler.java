package edu.brown.cs.student.main.handlers;
import com.squareup.moshi.*;
import edu.brown.cs.student.main.Constants;
import edu.brown.cs.student.main.jsonUtils.Serializer;
import spark.Request;
import spark.Response;
import spark.Route;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


public class FontHandler implements Route {
    public int _gptCount = 0;

    @Override
    public Object handle(Request request, Response response) {
        String descriptor = request.queryParams("adj");
        try {
            return this.fontInfo(this.fontify(descriptor), descriptor);
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<>();
            map.put("result", "error_bad_json");
            map.put("message", "unknown request" + e);
            return Serializer.serializeFailure(map);
        }
    }

    public String fontify(String descriptor) throws Exception {
        String url = "https://api.openai.com/v1/completions";
        HttpURLConnection gpt = (HttpURLConnection) new URL(url).openConnection();


        gpt.setRequestMethod("POST");
        gpt.setRequestProperty("Content-Type", "application/json");
        gpt.setRequestProperty("Authorization", "Bearer "+ Constants.GPT_KEY);

        Map<String,Object > data = new HashMap<>();
        data.put("model", "text-davinci-003");
        data.put("prompt", "Choose a google font given an adjective. \n\nSexy:Lora\nRugged:Special Elite\nsilly:Comic Neue\n"+descriptor+":");
        data.put("max_tokens", 200);
        data.put("temperature", .9);

        Moshi moshi = new Moshi.Builder().build();
        JsonAdapter<Map<String, Object>> jsonAdapter = moshi.adapter(Types.newParameterizedType(Map.class, String.class, Object.class));
        String jsonData = jsonAdapter.toJson(data);

        gpt.setDoOutput(true);
        gpt.getOutputStream().write(jsonData.getBytes());
        String jsonResponse = new BufferedReader(new InputStreamReader(gpt.getInputStream())).readLine();

        JsonAdapter<Map<String, List<Map<String, Object>>>> gptAdapter = moshi.adapter(Types.newParameterizedType(Map.class, String.class, Object.class));
        Map<String, List<Map<String, Object>>> responseMap = gptAdapter.fromJson(jsonResponse);
        List<Map<String, Object>> choicesList = responseMap.get("choices");
        Map<String, Object> firstChoice = choicesList.get(0);
        String output = (String) firstChoice.get("text");
        return output;
    }

    public String fontInfo(String gptFont, String descriptor) throws Exception {
        String font = gptFont.trim().replace(" ","+").replace("\"", "").replace("'", "");
        System.out.println(font);
        String url = "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCj_Mhke0zUczf0viyXaHvAgrwn_ww3288&family="+font;
        try{
            HttpURLConnection fontConnection = (HttpURLConnection) new URL(url).openConnection();
            fontConnection.setRequestMethod("GET");

            Moshi moshi = new Moshi.Builder().build();
            JsonAdapter<FontResponse> adapter = moshi.adapter(FontResponse.class);
            BufferedReader bReader = new BufferedReader(new InputStreamReader(fontConnection.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = bReader.readLine()) != null) {
                response.append(inputLine);
            }
            bReader.close();
            fontConnection.disconnect();
            FontResponse fontResponse = adapter.fromJson(response.toString());
            return new FontSuccessResponse(font,fontResponse.items.get(0).category).serialize();

        } catch (Exception e) {
            if(this._gptCount <4){
                this._gptCount++;
                return this.fontInfo(this.fontify(descriptor), descriptor);
            }else{
                return new FontFailureResponse("Error","Invalid input: Try using another keyword for your font!").serialize();
            }
        }

    }

    public record FontFailureResponse(String result, String error_message) {
        public String serialize() {
            Map<String, Object> responseMap = new LinkedHashMap<>();
            responseMap.put("result", this.result);
            responseMap.put("error_message", this.error_message);
            return Serializer.serializeFailure(responseMap);
        }
    }

    public record FontSuccessResponse(String font, String style) {
        public FontSuccessResponse(String font) {
            this("success", font);
        }
        public String serialize() {
            Map<String, Object> responseMap = new LinkedHashMap<>();
            responseMap.put("font", this.font);
            responseMap.put("style", this.style);
            return Serializer.serializeSuccess(responseMap);
        }
    }

    public static class FontResponse {
      public String kind;
      public List<Font> items;

      public static class Font {
          public String family;
          public List<String> variants;
          public List<String> subsets;
          public String version;
          public String lastModified;
          public Files files;
          public String category;
          public String kind;
          public String menu;

          public static class Files {
              public String regular;
          }
      }
  }
}