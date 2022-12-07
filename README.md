# Discord-SlimJet-Linux
Discord using slimjet wrapper
# Installation
Zip download, and extract to slimjet folder of version 35.0.3.0(archive version, no guarantee it'll work any other way)(or use releases)
Run ```bash discord.sh```

> Why?

All custom lightweight clients were using wayyy more modifications than discord was comfortable with. Using them might get you banned. This should be(hopefully) lighter than stock discord, we need somebody to verify

>Why SlimJet(chromium based)and not midori(gtk?? or maybe electron???)?


It was leading to slowdown on my device

# Known Issues
For some reason discord is not showing the chat size adjusting thing, so grab a mouse, and hold control while moving mouse wheel up-down to your liking.

# Things you must do if you want to fork this or update this:
1. Download latest slimjet release
2. Edit flashpeak-slimjet & Remove the part that creates desktop file
4. Edit my discord.sh file to your liking
