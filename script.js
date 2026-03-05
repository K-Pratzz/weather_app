const apiKey = "0201f292126f678a397019e6aabd74df";
const history=document.getElementById("historyAreaBox");

const searchButtonNow=document.getElementById("searchButtonNow");
const xyz=document.getElementById("cityInputBox");


async function weatherData(city){
    const display=document.getElementById("weatherDisplayResult")
    
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if(!response.ok){
            throw new Error("City not found!!");
        }
        const data= await response.json();
        display.innerHTML = `
            <p><b>City:</b>${data.name}, ${data.sys.country}</p>
            <p><b>Temp:</b>     ${data.main.temp}°C</p>
            <p><b>Weather:</b>${data.weather[0].main}</p>
            <p><b>Humidity:</b>${data.main.humidity}%</p>
            <p><b>Wind:</b> ${data.wind.speed} m/s</p>
        `;

        let alreadyExist=false;
        const items=history.querySelectorAll("span");
        items.forEach((item)=>{
            if(item.textContent.toLowerCase()===city.toLowerCase()){
                alreadyExist=true;
            }
        });

        if(!alreadyExist){
            const his=document.createElement("span");
            his.textContent=city;
            his.className="span";
            history.appendChild(his);
            his.onclick=() =>{
                weatherData(his.textContent);
            }
        }

    }catch(err){
        display.innerHTML = "<p style='color:red'>City not found</p>";
        console.error(err);

    }
    xyz.value="";
}
searchButtonNow.addEventListener("click",()=>{
    const city=document.getElementById("cityInputBox").value.trim();
    if (city){
        weatherData(city);
    }
});