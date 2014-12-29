SVG folder
===========

Put SVG files in this folder for the images you want to include in your iconfont.

##Making SVGS



Open a new file in Adobe Illustrator. Make this file 500px high; the initial file width can be 500px wide. Paste your vector into this new Illustrator file. 

Go to your Fireworks file and select the icon you want to use. 

Edit > Copy as Vector > click okay on pop-up

Paste into the Illustrator file you just created.

Click on the black arrow, then select all, and drag one of the corners of the icon while holding down the shift key so that it is 500px high. Adjust your artboard so that it is the width of your icon. It's important that all the icons in your group are the same height so that they render the same way.

Be sure your icon is FULLY ungrouped and when the layer is opened, all you see are Paths. If you see any Groups or Compound Groups be sure to ungroup further and delete any excess layers so that only Paths are left. 
Sometimes Compound Paths will not ungroup – this is usually fine.


Open Window > Pathfinder. If the paths are not separate from each other (exp: Facebook, LinkedIn icons) choose Exclude. If the paths are connected choose Unite.
In either case the result should be white overall with the paths outlined in blue. If it’s not all white you need to review how you used Pathfinder or it may still have a grouped element. If it has a Compound Path it make not go all white. You’ll keep to finish up the rest to see if works.

Save As > name.svg > When SVG Options pop-up appears be sure Type reads SVG.

Please add your finished svg file to BigDev>DeveloperDocuments>svg so we can keep building up our library.

To view your fonts in the CMS preview, move the woff file to the end of the font list and use format('embedded-opentype') instead of format('eot') for the iefix font.
