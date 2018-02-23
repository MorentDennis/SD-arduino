# Monster Kong

This is a simple game I built to practice some Phaser fundamentals. This game very closely resembles the play style of the original Donkey Kong.

Here is a live version of the final product:

[Demo](https://chrisbremmer.github.io/monster-kong/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this game locally you will need to be able to run your own server. For this I either suggest using [Python](https://www.python.org/downloads/) or a basic HTTP-Server requiring you have [Node](https://nodejs.org/en/download/) installed. Assuming one of those two are installed on your system you can continue on to the installing section.

### Installing

Make sure you have [Python](https://www.python.org/downloads/) or [Node](https://nodejs.org/en/download/) installed before continuing.

Clone the repository

```
git clone https://github.com/chrisbremmer/monster-kong
```

cd into folder

```
cd virtual-pet
```

This is where the steps differ for Python and Node!

Start a Python web server

```
python -m SimpleHTTPServer 8000
```

OR

Start a HTTP-Server

```
<!-- first download the npm package -->
npm i http-server
<!-- start the server -->
http-server -p 8000
```

View the game at:

```
localhost:8000
```

## Built With

* [Phaser](http://phaser.io/) - The game framework used
* [FreeSound](https://freesound.org/) - The sounds for the game
* [OpenGameArt](https://opengameart.org/) - Source for game art
* [Python/SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html) - Python SimpleHTTPServer Docs
* [Node/HTTP-Server](https://www.npmjs.com/package/http-server) - Node HTTP-Server Docs

## Authors

* **Chris Bremmer** - [Personal Site](chrisbremmer.com)
