# jstts

![jstts](./assets/jstts.jpg)

## Overview

This is a fully client-side, JavaScript-only Text-to-Speech (TTS) service using eSpeakNG. No server-side bullshit. Just clone this repo into your desired directory, and you're all set.

## Installation

1. Open your terminal.
2. Navigate to the directory where you want this TTS magic to happen.
3. Run `git clone https://github.com/psyb0t/jstts.git .` (Don't forget the dot at the end; it's not a typo. It means to clone into the current directory.)

And boom, you're done.

### Test It Locally

Run `python3 -m http.server 8080` in the directory where you cloned the repo. Open your browser and go to `http://localhost:8080`.

## Query Parameters

You can customize the TTS output using the following query parameters:

- `text`: The text you want to convert to speech.
- `rate`: The speed of the speech (default is 175).
- `pitch`: The pitch of the speech (default is 50).
- `voice`: The voice to use for the speech (default is "en").

Example URL: `http://localhost:8080?text=Hello&rate=175&pitch=50&voice=en`
