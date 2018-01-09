# SaveMedia- Browser plugin to save Snaps

## Getting started (firefox from v57)
1. Click this link to start installing.
https://github.com/buggyj/savemedia/releases/download/0.0.1/save_media-0.0.1-an.fx.xpi

## Getting started (chrome)
1. Install by downloading (goto the release https://github.com/buggyj/savemedia/releases and download by click the 'source code' zip link) and unzipping (e.g. in a directory called savemedia). 
Then in chrome navigate to chrome://extensions/ and click 'load unpacked extension' and go the savemedia/extension/ directory to select the extension (it's the directory containing the 'manifest.json' file).

Note that chome with ask you to disable the 'developer mode' extensions each time you start the browser (but not with linux), as the extension was not loaded from the Chrome Web Store.

## Aim
1. to facilitate saving snaps to disk. 

## Scope and limitations
1. This is a browser extension designed to work with chrome and other chromium based browsers, and the new firefox browser (v57 and latter).
2. Due to browser restrictions tiddlywikis must be located below a subdir of the browser's download directory . 
3. A test file needs to be downloaded (and then delete) to find the location of the download directory as there is no api for reading the download directory location.

## Gotchas
In chome there is the event 'onDeterminingFilename' which extensions can watch for and override the target DownloadItem.filename (some extensions move downloads into different folders by file type) which would break things. 
onDeterminingFilename has not been implemented in firefox.


