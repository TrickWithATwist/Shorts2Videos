//setting up the elements
const onoffelement = document.getElementById("onoff")
const addelement = document.getElementById("addbutton")
const clearelement = document.getElementById("clearbutton")
const instructionelement = document.getElementById("instructions")
const debugelement = document.getElementById("debug")

//on off button function and essential values 
onoffelement.onclick = function()
{
    chrome.runtime.sendMessage({event: "onoff"});
}
debugelement.onclick = function()
{
    chrome.runtime.sendMessage({event: "debug"});
}
