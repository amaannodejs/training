const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const siteinfo=[]



const getPageInfo=(url)=>{
    return new Promise((resolve,reject)=>{
      
            const pageInfo=[]
            JSDOM.fromURL(url).then(dom => {
            
            const divs=dom.window.document.querySelectorAll('._1fQZEK')
            divs.forEach(div=>{
                
                const title=div.querySelectorAll('._4rR01T')[0].textContent
                const price=div.querySelectorAll('._30jeq3')[0].textContent
                const imageUrl=div.querySelectorAll('._396cs4 ')[0].src
                const info=[]
                div.querySelectorAll('.rgWa7D').forEach(ele=>{
                    info.push(ele.textContent)
                })
                pageInfo.push({title,price,imageUrl,info})
                if(divs.length==0){return reject(false)}
                resolve(pageInfo)
        
        
            })
           
        });
        
       
    })
}

const getAllPageInfo=async ()=>{
    let i=1
        while(true){
            const pageInfo=await getPageInfo('https://www.flipkart.com/search?q=mobile&page='+String(i))
         
            //console.log(pageInfo)
            if(!pageInfo){break}
            siteinfo.push(pageInfo)
            console.log(pageInfo)
            i++;

        }
}


console.log(siteinfo)




//dom element >> _1fQZEK >> for li(s).rgWa7D ,  for title._4rR01T , for price._30jeq3 _1_WHN1, for image._396cs4 _3exPp9
