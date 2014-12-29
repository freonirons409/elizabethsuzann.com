@echo off
color 07
echo +-----------------------------+
echo ^| Enter one of the following: ^|
echo +-----------------------------+
echo 
echo (1) - Start server and watch for scss changes. http://localhost:3000 will refresh on html, js, and css changes.
echo (2) - Create and build /dist folder. For when you are ready for structure.
echo (3) - Open http://localhost:3000 in chrome
echo (4) - Update to latest version of foundation
echo (5) - Update all bower components
echo (6) - Generate and preview iconfont, uncomment out @import _icons in main.scss to include styles.
echo (7) - Exit


set /p key= Enter your selection:
IF %key% == 1 (
	echo starting server, and initializing watching of files...
	call gulp
)
IF %key% == 2 (
	echo this will take a moment...
	call gulp build
	)
IF %key% == 3 (
	echo test
start chrome.exe http://localhost:3000

	)
IF %key% == 4 (
	echo Updating foundation...
	call bower update foundation

	)
IF %key% == 5 (
	echo Updating all bower dependencies...
	call bower update

	)
IF %key% == 6 (
	call gulp make-iconfont
	call gulp view-iconfont
	start chrome.exe http://localhost:3000/font-preview.html
	)
IF %key% == 7 (exit /b)
