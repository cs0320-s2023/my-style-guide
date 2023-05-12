package edu.brown.cs32.student;

import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.handlers.ColorHandler;
import edu.brown.cs.student.main.handlers.FontHandler;
import edu.brown.cs.student.main.jsonUtils.ColorResponseJSON;
import edu.brown.cs.student.main.proxy.ColorProxy;
import edu.brown.cs32.student.mocks.ColorMocks;
import okio.Buffer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Request;
import spark.Spark;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestFont {

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
        Spark.get("font", new FontHandler());
        Spark.init();
        Spark.awaitInitialization();
    }

    @AfterEach
    public void teardown() {
        Spark.unmap("font");
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

    @Test
    public void testSerifs() throws Exception {
        FontHandler fonthandler = new FontHandler();
        assertTrue(fonthandler.fontInfo("Abel").contains("sans-serif"));
    }

    @Test
    public void testSpellingError() throws Exception {
        FontHandler fonthandler = new FontHandler();
        assertTrue(fonthandler.fontInfo("Open Sans").contains("Open+Sans"));
        assertTrue(fonthandler.fontInfo("  Open Sans").contains("Open+Sans"));
        assertTrue(fonthandler.fontInfo("Open+Sans").contains("Open+Sans"));
    }

    @Test
    public void testUnknownFont() throws Exception {
        FontHandler fonthandler = new FontHandler();
        assertTrue(fonthandler.fontInfo("Open Sans").contains("Open+Sans"));
        assertTrue(fonthandler.fontInfo("  Open Sans").contains("Open+Sans"));
        assertTrue(fonthandler.fontInfo("Open+Sans").contains("Open+Sans"));
    }

}
