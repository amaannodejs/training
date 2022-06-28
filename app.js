const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const siteinfo=[]



const getProductInfo=(url)=>{
    return new Promise((resolve,reject)=>{
      
            const pageInfo=[]
            JSDOM.fromURL(url).then(dom => {
                console.log(url)
                const productTitle=dom.window.document.querySelectorAll('.pdp-e-i-head')[0].textContent.trim(),
                    price=dom.window.document.querySelectorAll('.payBlkBig')[0].textContent,
                    image=dom.window.document.querySelector('#bx-slider-left-image-panel > li:nth-child(1) > img').src,
                    discription=dom.window.document.querySelector('#id-tab-container > div > div:nth-child(3) > div.spec-body > div').textContent.trim()
                    if(dom.window.document.querySelectorAll('.avrg-rating')[0]){
                        rating = dom.window.document.querySelectorAll('.avrg-rating')[0].textContent
                    }else{
                        rating = "0.0"
                    }
                    
                    const colors =[]
                    dom.window.document.querySelectorAll('.ellipses-cls').forEach(ele=>{
                        colors.push(ele.textContent)
                    })
                    const highlights=[]
                    dom.window.document.querySelectorAll('.dtls-li .h-content').forEach(ele=>{
                        highlights.push(ele.textContent)
                    })
                    const sizes=[]
                    dom.window.document.querySelectorAll('.attr-squared').forEach(ele=>{
                        sizes.push(ele.childNodes[1].textContent)
                    })
                    resolve({productTitle,price,image,discription,rating,colors,highlights,sizes})
                        
           
        });
        
       
    })
}
const getPageurls=(url)=>{
    return new Promise((resolve,reject)=>{
        JSDOM.fromURL(url).then(dom => {
            const pageUrls=[]
            dom.window.document.querySelectorAll('.product-title ').forEach(ele=>{
                pageUrls.push(ele.parentElement.href)
            })
            resolve(pageUrls)

        }).catch(err=>console.log(err))

    })
}

const getAllPageInfo=async (url)=>{
    const baseUrl='https://www.snapdeal.com/acors/json/product/get/search/193/'
    let count=1
    const siteData=[]

    while(true){
       const pageUrls= await getPageurls('https://www.snapdeal.com/acors/json/product/get/search/193/'+count+"/20")
       if(pageUrls.length==0){break}
       for(let i =0; i<pageUrls.length;i++){
        const productInfo= await getProductInfo(pageUrls[i])
        console.log(productInfo)
        siteData.push(productInfo)

       }
       //console.log(siteData)
       count++



    }

console.log(siteData)
//   pageInfo=await getPageInfo('https://www.snapdeal.com/product/leotude-100-percent-cotton-multi/8070451214298476807')

}
getAllPageInfo()




///page title document.querySelectorAll('.pdp-e-i-head')[0].innerText
///price document.querySelectorAll('.payBlkBig')[0].innerText

/// discription document.querySelector('#id-tab-container > div > div:nth-child(3) > div.spec-body > div').innerText
/// image document.querySelector('#bx-slider-left-image-panel > li:nth-child(1) > img').src
/// rating document.querySelectorAll('.avrg-rating')[0].innerText
/// color document.querySelectorAll('.ellipses-cls')[i].innerText
///highlights document.querySelectorAll('.dtls-li .h-content')[i].innerText
//size document.querySelectorAll('.attr-squared')[i].childNodes[1].innerText


//https://www.snapdeal.com/acors/json/product/get/search/193/0/20
//original link
//https://www.snapdeal.com/acors/json/product/get/search/193/{pagenumber}/20

//to get link og page document.querySelectorAll('.product-title ')[0].parentElement.href