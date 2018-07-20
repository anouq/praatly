# Praatly

## What is this?
Praatly is an app that reads [Praat](http://www.fon.hum.uva.nl/praat/) sound objects and visualizes the results using [Plotly](https://plot.ly/javascript/).

## How does it work?
Record Praat sounds and save them to the object list. Download the [Praat script](src/assets/praatscript.praat) and run it in Praat via `Praat > Open Praat script > Run > Run`. Finally, upload the generated files to Praatly. The results are displayed by type, corresponding to the sound object name.

## Running the app
```
npm install
ng serve
```

## Requirements
This app requires at least Praat 6.0.40.
