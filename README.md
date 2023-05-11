# My Style Guide (Term Project)

**Team Members:** 
- Breckelle Zheng (bzheng12)
- Ezra Rocha (erocha1)
- Isaac Jenemann (ijeneman)
- Sam Feldman (sfeldma8)

**GitHub Repo:** https://github.com/cs0320-s2023/my-style-guide

**Time Spent:** TBD

## Design choices:

#### Front end: 

The front end is composed of two main components, one to take in user inputs and the other to display the results. The searchForm component contains one input text box for the user to enter one color and one font keyword to describe their desired UI design. The input is then tokenized and sent to the backend. The first token, the color, is passed to the backend and the hex values of 4 different colors are returned. The second token, the font keyword, is then passed to the backend which returns a font and style. The second component, StyleGuideBox, displays the data given by the backend. The four colors are displayed in their own boxes and labeled with their hex value. Below the four color boxes on the left side will be the name of the font given by the backend as well as examples of the font in four different sizes. On the right side, There will be six different buttons styled with the first and second color given from the backend. These buttons will all be slightly different to show how they would look under different states such as hover, active, or disabled.


#### Back end:

The back end contains two main route handlers, a proxy handler, as well as a top level server class. The server class is used to start the server as well as to set any configurations. The ColorHandler class handles the api call for the user's color input and returns a list of colors to be displayed on the front end. It works by having a JSON containing descriptions for each color. A filtered list is created containg colors with matching descriptions and then a color from the filtered list is chosen at random. The FontHandler class takes in the font description keyword and makes an api call to GPT3 which returns a specific a font from google's font library. A call is then made to google's fonts api which then returns a font family that can be used on the front end.



## Errors/Bugs:

## Tests:

## How to run:

Open Server.java in backend and click run. The message "Server Started" should be printed in terminal.

Run the following commands in terminal.

```
npm install

cd frontend
npm run dev

```