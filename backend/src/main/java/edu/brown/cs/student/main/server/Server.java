package edu.brown.cs.student.main.server;

import static spark.Spark.after;

import edu.brown.cs.student.main.handlers.FontHandler;
import edu.brown.cs.student.main.handlers.KeywordSearchHandler;
import spark.Spark;

import edu.brown.cs.student.main.handlers.CoordSearchHandler;

/**
 * Top-level class for this demo. Contains the main() method which starts Spark and runs the various handlers.
 * <p>
 * We have two endpoints in this demo. They need to share state (a menu).
 * This is a great chance to use dependency injection, as we do here with the menu set. If we needed more endpoints,
 * more functionality classes, etc. we could make sure they all had the same shared state.
 */
public class Server {

    public static void main(String[] args) {

        Spark.port(3232);
        /*
            Setting CORS headers to allow cross-origin requests from the client; this is necessary for the client to
            be able to make requests to the server. */

        after((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "*");
        });

        // Initializing the state of the server
        Spark.get("cosearch", new CoordSearchHandler());
        Spark.get("kwsearch", new KeywordSearchHandler());
        Spark.get("font", new FontHandler());
        Spark.init();
        Spark.awaitInitialization();
        System.out.println("Server started at http://localhost:3232.");
    }
}
