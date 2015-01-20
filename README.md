[![npm](https://nodei.co/npm/ass-parser.png)](https://nodei.co/npm/ass-parser/)

# ass-parser

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Parse SSA/ASS subtitle format.

[travis]: https://travis-ci.org/eush77/ass-parser
[travis-badge]: https://travis-ci.org/eush77/ass-parser.svg
[david]: https://david-dm.org/eush77/ass-parser
[david-badge]: https://david-dm.org/eush77/ass-parser.png

## Example

For the ASS subtitle below (from the [Wikipedia page](http://en.wikipedia.org/wiki/SubStation_Alpha))

```
[Script Info]
; This is a Sub Station Alpha v4 script.
; For Sub Station Alpha info and downloads,
; go to http://www.eswat.demon.co.uk/
Title: Neon Genesis Evangelion - Episode 26 (neutral Spanish)
Original Script: RoRo
Script Updated By: version 2.8.01
ScriptType: v4.00
Collisions: Normal
PlayResY: 600
PlayDepth: 0
Timer: 100,0000

[V4 Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, TertiaryColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, AlphaLevel, Encoding
Style: DefaultVCD, Arial,28,11861244,11861244,11861244,-2147483640,-1,0,1,1,2,2,30,30,30,0,0

[Events]
Format: Marked, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: Marked=0,0:00:01.18,0:00:06.85,DefaultVCD, NTP,0000,0000,0000,,{\pos(400,570)}Like an angel with pity on nobody

```

`assParser()` will return the following:

```json
[
    {
        "section": "Script Info",
        "body": [
            {
                "key": "Title",
                "value": "Neon Genesis Evangelion - Episode 26 (neutral Spanish)"
            },
            {
                "key": "Original Script",
                "value": "RoRo"
            },
            {
                "key": "Script Updated By",
                "value": "version 2.8.01"
            },
            {
                "key": "ScriptType",
                "value": "v4.00"
            },
            {
                "key": "Collisions",
                "value": "Normal"
            },
            {
                "key": "PlayResY",
                "value": "600"
            },
            {
                "key": "PlayDepth",
                "value": "0"
            },
            {
                "key": "Timer",
                "value": "100,0000"
            }
        ]
    },
    {
        "section": "V4 Styles",
        "body": [
            {
                "key": "Format",
                "value": [
                    "Name",
                    "Fontname",
                    "Fontsize",
                    "PrimaryColour",
                    "SecondaryColour",
                    "TertiaryColour",
                    "BackColour",
                    "Bold",
                    "Italic",
                    "BorderStyle",
                    "Outline",
                    "Shadow",
                    "Alignment",
                    "MarginL",
                    "MarginR",
                    "MarginV",
                    "AlphaLevel",
                    "Encoding"
                ]
            },
            {
                "key": "Style",
                "value": {
                    "Name": "DefaultVCD",
                    "Fontname": "Arial",
                    "Fontsize": "28",
                    "PrimaryColour": "11861244",
                    "SecondaryColour": "11861244",
                    "TertiaryColour": "11861244",
                    "BackColour": "-2147483640",
                    "Bold": "-1",
                    "Italic": "0",
                    "BorderStyle": "1",
                    "Outline": "1",
                    "Shadow": "2",
                    "Alignment": "2",
                    "MarginL": "30",
                    "MarginR": "30",
                    "MarginV": "30",
                    "AlphaLevel": "0",
                    "Encoding": "0"
                }
            }
        ]
    },
    {
        "section": "Events",
        "body": [
            {
                "key": "Format",
                "value": [
                    "Marked",
                    "Start",
                    "End",
                    "Style",
                    "Name",
                    "MarginL",
                    "MarginR",
                    "MarginV",
                    "Effect",
                    "Text"
                ]
            },
            {
                "key": "Dialogue",
                "value": {
                    "Marked": "Marked=0",
                    "Start": "0:00:01.18",
                    "End": "0:00:06.85",
                    "Style": "DefaultVCD",
                    "Name": "NTP",
                    "MarginL": "0000",
                    "MarginR": "0000",
                    "MarginV": "0000",
                    "Effect": "",
                    "Text": "{\\pos(400,570)}Like an angel with pity on nobody"
                }
            }
        ]
    }
]
```

## API

### `assParser(text)`

Returns the parse tree in a format described below.

## Format

Subtitle is a list of sections, each of them has `section` and `body` properties. The `body` is a list of key-value bindings (descriptors), with `key` and `value` properties.

`value` can be one of the following:
- array if the descriptor key is `"Format"`;
- object if there is a `"Format"` descriptor above in the section;
- string otherwise.

## References

- [Wikipedia page](http://en.wikipedia.org/wiki/SubStation_Alpha)
- [format specification](http://www.perlfu.co.uk/projects/asa/ass-specs.doc)

## Install

```shell
npm install ass-parser
```

## License

MIT
