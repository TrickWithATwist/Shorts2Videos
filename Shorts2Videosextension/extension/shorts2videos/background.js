//test
//establish essential variable current url
var currenturl;

//on/off button stuff
//0 = off 1 = on
var onoffstatus;

//var for the tab dropping status 
var tabdrop; 

//establishing varible for updated url
var link;

//function asynchronously loading in data hopefully?
//if button has already been pressed then the value that has been saved to the local storage will be new value
//for onoffstatus else the program will go on as usual as if onoffstatus is equal to 0
const getonoffstatus = () =>
{
    chrome.storage.local.get(["status"]).then((value) =>
        {
            if(value.status !== undefined)
            {
                onoffstatus = value.status;
            }
            else
            {
                onoffstatus = 0;
            } 
        })
}

// Define getCurrentTabURL as an async function
async function getCurrentTabURL() {
    return new Promise((resolve) => {
        setTimeout(() => {
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    resolve(tabs[0].url);
                } else {
                    resolve(null);
                }
            });
        }, 100); // Set timeout to 100 milliseconds
    });
}

//using these functions before chrome listens for events
getonoffstatus();
getCurrentTabURL();

//listening for messages
chrome.runtime.onMessage.addListener(async data => {
    const { event } = data;
    switch(event) {
        case "onoff":
            //code to toggle between on and off for the button and then save it 
            onoffstatus = 1 - onoffstatus;
            console.log(onoffstatus);
            handlestatus();
            break;
        case "debug":
            //prints out the status of the on/off button 
            console.log("OnOffStatus");
            console.log(onoffstatus);
            console.log(link);
            console.log(await getCurrentTabURL()); // Make sure to await here
            break;
        case "default":
            //empty
            break;
    }
});


//if tab updated
chrome.tabs.onUpdated.addListener(async () => {
    setTimeout(async () => {
        console.log("Tab created event triggered");
        //check the URL and change it if onoffstatus = 1
        //establishing variable that represents current URL 
        currenturl = await getCurrentTabURL();
        link = currenturl.replace("shorts", "watch");
        if (onoffstatus == 1 && currenturl && currenturl.includes("shorts")) {
            await chrome.tabs.update({ url: link });
        }
    }, 100); // Set timeout to 100 milliseconds
});



//if a tab has been created
chrome.tabs.onCreated.addListener(async () => {
    setTimeout(async () => {
        console.log("Tab created event triggered");
        //check the URL and change it if onoffstatus = 1
        //establishing variable that represents current URL 
        currenturl = await getCurrentTabURL();
        link = currenturl.replace("shorts", "watch");
        if (onoffstatus == 1 && currenturl && currenturl.includes("shorts")) {
            await chrome.tabs.update({ url: link });
        }
    }, 100); // Set timeout to 100 milliseconds
});

//if the user has gone to another tab that has been opened 
chrome.tabs.onActivated.addListener(async () => {
    setTimeout(async () => {
        console.log("Tab activated event triggered");
        //check the URL and change it if onoffstatus = 1
        //establishing variable that represents current URL 
        currenturl = await getCurrentTabURL();
        link = currenturl.replace("shorts", "watch");
        if (onoffstatus == 1 && currenturl && currenturl.includes("shorts")) {
            await chrome.tabs.update({ url: link });
        }
    }, 100); // Set timeout to 100 milliseconds
});

//functions
function handlestatus() {
    const data = { status: onoffstatus };
    //put this here to make sure that the code is actually working idk
    console.log("data has been saved", onoffstatus);
    chrome.storage.local.set(data);
}

//functions to avoid the dragging error
chrome.tabs.onDetached.addListener(() => {
    tabdrop = true;
});
chrome.tabs.onAttached.addListener(() => {
    tabdrop = false;
});
