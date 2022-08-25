# Vivaldi Search Bar Fix

There's an annoying issue in [Vivaldi](http://vivaldi.com) browser since June 2020:

You just can't properly use HOME or END keyboard keys in the Search bar when search suggestions are enabled.

This mod will try to workaround this.

### How to install the mod

I'd suggest to use [Vivaldi Mod Manager](https://gitlab.com/Neur0toxine/vivaldimodmanager) (VMM) as the easiest way to work with Vivaldi mods. Just run it, point it to your Vivaldi installation directory, and then import **[searchbarFix.js](https://github.com/rand256/vivaldi-search-bar-fix/blob/main/searchbarFix.js)** as a file. Then restart the browser and you're finished.

Note that you will need to reinstall the mod on every Vivaldi upgrade, so backup/restore feature of VMM comes very handy.

### What's going on - in details?

When you type anything in the Search bar and it produces suggestions in a neat popup nearby, then any attempt to press HOME or END keys to edit it leads to all your text is gone and being  _replaced_ with the text from one of the suggestions. Which is almost always _highly irrelevant_ to what you typed earlier. I'll repeat, all you typed is **_lost_**. And you have to type it _again_ and _again_. Should I say it could easily make even a very patient person dramatically angry when repeated for several times?

There was quite a few attempts to complain about this issue to Vivaldi developers either directly via their bugreport system or via Vivaldi community forums. Official bugreports _always_ ended with no response, silently rejected or just ignored - you even can't check what actually had happened with your inquery after you've sent it. That's how their bugreport system is _designed_. At forums, on the contrary, it was even possible to receive some _insightful_ answers including the assertions that, try to imagine, currently observed behavior just _"works as designed"_. So, losing typed text and having to retype it again could be _designed_ this way. Marvellous!

As of now, it's already been 2 years and 3 major Vivaldi versions since the issue is present and still ignored by the devs.

### What to do

On the bright side, Vivaldi allows us to hack into some of its internals and make **javascript mods** to workaround issues by ourselves. That looks definitely promising. But on the other side, it seems impossible to hack into _all_ of the internals, and unfortunately the code that generate suggestions doesn't seem to be properly available from javascript engine.

Specifically, it's simply impossible to catch HOME/END presses addressed to Search bar input by suggestions code, block it and replace their actions with our own. However it's still possible to _revert_ the perceived results and put back user typed text as it was before, and this mod tries its best to do just that.

### What the mod actually does

It tracks what the user types into the Search bar and saves it into a variable. Upon pressing HOME/END key, which destroys user input, it puts previously saved content back into the Search bar input. It would be great if that was enough, but unfortunately it's not.

It seems that Vivaldi HOME/END handler itself saves somewhere wrong Search bar value that it sets. So, if our handler replaces Search bar input content with another text, then some actions in the browser may trigger _resetting_ the text _back_ to wrong value set by Vivaldi handler. And it stops its attempts to reset the text only after user types something new into the Search bar input. That is the problem!

So most of the code in this mod exists in fact just to fight for keeping the proper text in the Search bar after it was already replaced by the mod.

### What the mod can't do

It can't protect user typed text seamlessly. It means that after pressing HOME/END key you'll be able to see how text is replaced with the wrong one (coming from one of suggestions) and then is replaced back. Though I guess it's not a huge cost for keeping the proper text in place.

What's worse, although there are several handlers already available in the mod to workaround those, I still believe there could be much more factors which may trigger resetting the text to the wrong values again. Besides, many cases should already be covered.

### Additional thoughts

Search bar in Vivaldi had always been in nearly broken-to-unusable state, almost from the initial release of this browser. 
Funny fact: before the current nonsense with text getting replaced by HOME/END keys was first introduced, there was another one: at that time you were unable to navigate through the search suggestions with arrow keys _unless_ you had Num Lock disabled. _Though HOME/END keys worked properly with no issues!_ The bug with arrow keys was also present _for years_, but when someone finally bothered to fix it, they immediately broke the HOME/END keys, and this is still present in Vivaldi 3, 4 and 5 releases and counting.

Maybe someone in Vivaldi is of principle against those users who want to use the Search bar?
