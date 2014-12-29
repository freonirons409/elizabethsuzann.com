boilerplate
===========

# Usage
Run _npm install_ and _bower install_. Run _gulp init_. Run _gulp_.

An express server is started on port 4000. Open up http://localhost:4000

### Livereload
On save of scss, js, or html, the page will reload.

### Autoprefixer 
On build out adds vendor prefixes for last two versions of every browser.

### Notifications
When there is a sass error a growl notification will pop up. If on Windows, must install [Growl for Windows](http://www.growlforwindows.com/gfw/) or [Snarl](http://sourceforge.net/projects/snarlwin/).

### Iconfonts
Add the svgs you want to use in your font to the svg folder. Then, open run.bat and select the option to generate and preview iconfont.  A preview window will open in Chrome.  Uncomment '@import "_icons";' in main.scss to include the font styles and view your font in the preview window.

For more information on making svgs, consult the README in the svg folder.

