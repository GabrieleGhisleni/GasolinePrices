
# Open Gasoline | Web App

## Application made to find to find the cheapest gasoline stations in italy.

Simple React.js application that allow to locate which are the most economies gasoline stations around the municipality given. 

### Under the Hood.

This application take advantage of the github actions and the possibility to overwrite the github repository in an autonomous way, in particular:

1. Every two days a Github action call a bounch of [Python scripts](https://github.com/GabrieleGhisleni/GasolinePrices/tree/master/src) which fetch the gasoline prices directly from the italian government website, process them and dump all the updated prices and information in json, divided by municipality, inside this github repository.

2. When using the React application basically we are providing a way to access and display properly those data inside a map, said so the react application consists of a fetch api to github repository specific to the municipality required and trough the usage of Leafleft.js a proper rendering of the data on a context map.

3. Every five days another Github action call others scripts that update the meta-data on the gasoline stations (such as name and other properties) allowing to include new stations, in case they are.

4. This is the map of all the gasolines stations in italy: ![Image](../master/data/italian-station.png)