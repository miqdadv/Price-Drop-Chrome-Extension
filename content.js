console.log("Entered the content.js");

const title = document.getElementsByTagName('title')[0].innerText;
console.log(title);

if(title.substring(0,3) == "Buy"){

    const prodName = document.getElementById('productTitle').innerText;
    const price = document.getElementById('priceblock_ourprice').innerText;
    let aTags = document.getElementsByTagName("span");

    let searchText = "ASIN";
    let found;
    let b = 0;
    for (let i = 0; i < aTags.length; i++) {
        found = aTags[i].innerText;
        if(b == 1)
            break;
        if (aTags[i].textContent.length > 4 && aTags[i].textContent.substring(0,4) == searchText) {
            b = 1;
        }
    }
    const itemNumber = found;
    let item = {
        name : prodName,
        price : price,
        item_n : itemNumber,
        message : "Add this to products"
    }
    chrome.runtime.sendMessage(item, function(req, res){
        console.log(res);
    })
}