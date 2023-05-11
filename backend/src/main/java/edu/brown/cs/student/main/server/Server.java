package edu.brown.cs.student.main.server;

import static spark.Spark.after;

import edu.brown.cs.student.main.handlers.ColorHandler;
import edu.brown.cs.student.main.handlers.FontHandler;
import spark.Spark;

/**
 * Top-level class. Contains the main() method which starts Spark and runs the various handlers.
 */
public class Server {

    public static void main(String[] args) {

        Spark.port(3333);

        after((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "*");
        });

        // Initializing the state of the server
        Spark.get("color", new ColorHandler());
        Spark.get("font", new FontHandler());
        Spark.init();
        Spark.awaitInitialization();
        System.out.println("Server started at http://localhost:3232.");
    }
}
