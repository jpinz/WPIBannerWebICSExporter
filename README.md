WPIBannerWebICSExporter
=======================

<a href = "https://chrome.google.com/webstore/detail/pngenbfogplghjijjdlfcemfkbdpjfee/"><img src = "http://evinugur.com/chrome.png"></a>

Chrome extension to export an ICS from your WPI Bannerweb schedule:

* Log into BannerWeb and View Your Schedule 
* Make sure you navigate to a week that has all your classes (the first week of school, for example, only has 2 classes)
* click the big button at the top of the page that the extension loads in
* you now have an ICS file for your classes - add it to your favorite calendar program!

## Improvements

The app can use some optimizations for determing which term you're currently in (right now it just defaults to A-term as a hack, but that works for the time being...).
Additionally, the app will need to be maintained as the DOM of BannerWeb evolves, although I find that unlikely given how antiquated it already is.

Finally, this approach only exists because there simply is no better way to make a cal file without entering data by hand. Either WPI should have that functionaity, or expose said data as an API so we don't have to scrape their DOM
