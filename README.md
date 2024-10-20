# Pinyin Input

[Japanese version is here](README-ja.md)

## Overview
"Pinyin Input" is a Visual Studio Code extension that converts numbered pinyin (e.g., `hao3`) into pinyin with tone marks (e.g., `hǎo`). This extension facilitates smoother input for Chinese language learners and users.

## Features
- **Easy Conversion**: Automatically converts tones represented by numbers into tone marks.
- **Simple Toggle Functionality**: Easily switch the extension on and off using a command.
- **Optimized for Plain Text Files**: Particularly designed for use in plain text files.

## Usage

1. **Installation**:
   - Open Visual Studio Code and search for "Pinyin Input" in the Extensions Marketplace to install it.

2. **Activating the Extension**:
   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and select "Toggle Pinyin Input" to activate the extension.

3. **Inputting Pinyin**:
   - In the plain text editor, input pinyin. For example, typing "hao3" will automatically convert it to "hǎo".
   - Typing "v" will convert it to "ü".

## Commands
- **Toggle Pinyin Input**: Toggles the extension on and off.

## Dependencies
- This extension requires the following dependencies:
  - **Node.js**: v16.x or later
  - **TypeScript**: v4.4.x or later

## Developer Information
- **Build**: This extension is written in TypeScript, and you can build it using the following scripts:
  - `npm run compile`: Executes the build.
  - `npm run watch`: Runs the build in watch mode.

## License
This extension is provided under the [MIT License](https://opensource.org/licenses/mit-license.php).

## Contributing
Bug reports and feature requests are welcome. Feel free to reach out in the GitHub repository.

---

Enjoy using this extension for a smoother Chinese input experience!
