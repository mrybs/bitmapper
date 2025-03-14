if(window.Bitmapper.devtools.enabled){
    window.Bitmapper.devtools.devtools.style.transform = 'translateX(0%)'
}
else{
    window.Bitmapper.devtools.devtools.style.transform = 'translateX(100%)'
}

document.addEventListener("keypress", (event) => {
    if(event.code === "BracketRight"){
        window.Bitmapper.devtools.enabled = !window.Bitmapper.devtools.enabled
        if(window.Bitmapper.devtools.enabled){
            window.Bitmapper.devtools.devtools.style.transform = 'translateX(0%)'
        }
        else{
            window.Bitmapper.devtools.devtools.style.transform = 'translateX(100%)'
        }
    }
});
