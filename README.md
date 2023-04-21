## Maps (Capstone)

Ezra Rocha (erocha1) and Scott Petersen (hpeter11)

Total time to complete project: 30 hours

Link to repo: https://github.com/cs0320-s2023/sprint-5-erocha1-hpeter11 

### How to run Maps:
To get the server up and running, open the backend file in a separate application and run the main server file. Next, enter the front end folder by opening the front end project file locally or entering “cd frontend” into the full project terminal. Finally, enter "npm run dev" and click on the local host link to open the web application. 

### How to use Maps:
On the display, there is a map and a user interface on the right. The top input boxes take latitude and longitude values ranging from -90 to 90 and -180 to 180. The bottom box searches via a keyword for areas containing the keyword in their description. This data is highlighted on submit but any coordinate data already being displayed remains on the map. The redlining data displayed is based entirely on whichever button was clicked last and whether the proper parameters were inputted. If improper parameters were inputted, the user data will not display. At the bottom, the success or failure message is displayed to the user to indicate whether or not there was a problem.

### Design choices:

#### Front end: 
Components file stores the MapBox file which makes up the majority of the display and the SearchForm file makes up the rightmost div that takes user input. MapBox is designed to automatically display data for the whole country when opened, but the SearchForm file handles separate inputs by changing state to pass the inputs to the two back end handlers. The MapBox overlay is always the same but the input GeoJSON response varies depending on the last button pressed. Errors will not cause the map to shut down or break. Rather, they will not change the display and be communicated to the user.

#### Back end:
The back end is separated into a local server and two handlers. The coords handler takes four coordinate points and filters the JSON data to be within those coordinates based on the JSON property values. The keyword search does the same thing using region. The response value is returned as either a failure message or the serialized GeoJSON.

### Organization:

#### Front end:
Within SRC, the components folder includes the broader MapBox div and the smaller user SearchForm div. Utils holds structured logic for overlays. There is a private folder which contains the MapBox token. You will not be able to run the project without your own private token. 

#### Back end:
The data package contains the fullDownload JSON, which has all of the redlining information necessary to overlay on top of the map. The server package contains the main class, which calls on both handlers from the handlers package. Tools for managing JSONs like serialize, JSONReader, and the GeoJSONResponse format are all contained in the utils package and for use by the handlers.

### Accessibility:
Several components within the SearchForm contain aria-labels that are intended to help users with visual impairments
to use our web application with ease. There are two shortcuts that are available for focusing on SearchForm input boxes. Pressing the "PageUp" button will focus on the first coordinate input box (minimum Latitude). Pressing the "PageDown" button will focus on the keyword input box. We attempted to add a focus feature for the MapBox component
as well, but were not able to do so using MapRef.

### Reflection:
1. Java
2. Typescript
3. HTML/CSS
4. React library
5. JSX
6. DOM testing library
7. Moshi
8. Stack overflow advice
9. Redlining data JSON
10. Visual Studio Code
11. IntelliJ
12. Apple and HP hardware