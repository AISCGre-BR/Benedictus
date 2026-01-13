# Benedictus

(WIP) a GUI for gregorio, an open-source GABC editor similar to Finale, Musescore, etc.

- Integration with git for easy colaboration with both programmers and non-programmers.
- Focus on ease of use, with a familiar interface for those who are used to modern sheet music editors.
- Precise view and rendering with direct gregorio integration.

### Future goals

- Support more advanced gregorio features, especially NABC editing, for both simplex and triplex notation.
- Support for chord insertion (current software)

### Reference photo

![Reference photo](reference.png)


### Development

This project uses Typescript + Vue, inside Electron.

Bun is used for the typescript implementation

With bun installed in your system, run:

```bash
bun install
```
and when you want to open the UI, run:
```bash
bun start
```
This will automatically clean up, build and open the electron app