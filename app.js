const puppeteer = require('puppeteer');


const getUrls=async(url)=>{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return new Promise((resolve, reject)=>{
        page.evaluate(() => {
            const urls=[]
            document.querySelectorAll('._1fQZEK').forEach(ele=>{
                urls.push(ele.href)
            })
            //console.log(urls)
           // browser.close()
            return urls
        }).then(urls=>{
            resolve(urls)
        }).catch(err=>console.log(err))
    })
}
const getProductInfo=async(url)=>{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return new Promise((resolve, reject)=>{
        page.evaluate(() => {
            const title=document.querySelectorAll('.B_NuCI')[0].textContent,
                price=document.querySelectorAll('._16Jk6d')[0].textContent,
                rating=document.querySelectorAll('._2d4LTz')[0].textContent,
                imageUrl=document.querySelectorAll('._2amPTt')[0].src,
                seller=document.querySelectorAll('._1RLviY')[0].childNodes[0].textContent,
                highlights=[]
                document.querySelectorAll('._21Ahn-').forEach(ele=>{
                    highlights.push(ele.textContent)
                })
                const keys=document.querySelectorAll("._1UhVsV ._1hKmbr"),
                values=document.querySelectorAll("._1UhVsV ._21lJbe"),
                specs=[]
                for(i=0;i<keys.length;i++){
                    let a={}
                    a[keys[i].textContent]=values[i].textContent
                    specs.push(a)
                }
                //browser.close()
                return {title,price,rating,imageUrl,seller,highlights,specs}
        }).then(productInfo=>{
            resolve(productInfo)
        }).catch(err=>console.log(err))
    })
}


const getSiteInfo=async()=>{
    const baseUrl='https://www.flipkart.com/search?q=mobile&page=',
    siteinfo=[]
    let count=1
     //urls=await getUrls(baseUrl)
    while(true){
     const urls=await getUrls(baseUrl+String(count))
     if(urls.length==0){break}
     for(let i=0;i<urls.length;i++ ){
         const productInfo=await getProductInfo(urls[i])
         siteinfo.push(productInfo)
         console.log(productInfo)
 
     }
    }
     
    
 }
getSiteInfo()


 
//     await browser.close();
//   })();