# Mighty Resource Viewer

An app used to unpack and preview the game files used by _Power Pete_ and _Mighty Mike_.

## Instructions

```sh
# Clone repository
$ git clone ...

# Install dependencies
$ cd mighty-resource-viewer
$ yarn install

# Start local server
$ yarn start

# Then, copy your game files into src/assets/Data/
# and navigate to http://localhost:4200/ in your browser
```

## To do list

-   [ ] Convert compressed `snd` resources to a playable format
    -   See <https://ffmpeg.org/doxygen/3.1/mace_8c_source.html> for an implementation of the MACE 3:1 algorithm used to compress the music tracks and some sound effects
-   [ ] Show items in map viewer
-   [ ] Decode tile animations and add a way to preview them
-   [ ] Implement LZSS to unpack the spin animation

## Screenshots

![](./docs/audio.png)

![](./docs/image.png)

![](./docs/map.png)

![](./docs/shapes.png)

![](./docs/tileset.png)
