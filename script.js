const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const aqRemarks = ['Good', 'Fair', 'Moderate' ,'Poor', 'Very Poor']
const aqDescs = ['A perfect day for a walk!', 'Everything is alright!', 'Go out only when necessary.', 'It is good to stay indoors for a while', 'It is very bad outside!']
            $('.air-card').css('color', )
const aqColors = ['#1BC370', '#00a7b3', '#dfbd00', '#e98400', '#e90000']
const aqBgc = ['#F0FFF5', '#f0fffd', '#fffff0', '#fff6f0', '#fff0f0']
const acTags = ['pm2_5', 'pm10', 'so2', 'no2', 'o3', 'co']

var lat, lon, today;

const apiKey = 'a871dce4502a7f61db18d8733a5a100e'
var aqi = 1
var cityName = 'Delhi'
var cities = ['Delhi', 'Tokyo', 'New York']
var cityData = [null, null, null]


function collapse(context){
    if ($(context).children('.minv').hasClass('gone')){
        $(context).children('.maxv').addClass('gone')
        $(context).children('.minv').removeClass('gone')
        $(context).css('background', '#FFF')
    } else {
        $(context).children('.minv').addClass('gone')
        $(context).children('.maxv').removeClass('gone')
        $(context).css('background', '#FFF8EF')
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function removeSS(context){
    $(context).parent().parent().parent().parent().remove()
}

function newDiv(ssc, srt, sst){
    return $.parseHTML(`<div class="container cdy mt-2" onclick="collapse(this)">
<div class="maxv px-4 py-3 gone">
    <div class="row mb-3">
        <div class="col">
            <i class="fa fa-map-marker blue"></i>&nbsp;
            <span class="h6 ssc">${ssc}</span>
        </div>
        <div class="col-auto">
            <button onclick="removeSS(this)" class="btn btn-light p-1 m-0 mx-1"><i class="fa fa-close"></i></button>
        </div>

    </div>

    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col-auto m-2 p-0"><i
                        class="wi wi-sunrise yellow h3"></i></div>
                <div class="col">
                    <div class='gray-text'>Sunrise</div>
                    <h6 class="h6 blue srt">${srt}</h6>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="row">
                <div class="col-auto m-2 p-0"><i class="wi wi-sunset yellow h3"></i>
                </div>
                <div class="col">
                    <div class='gray-text'>Sunset</div>
                    <h6 class="h6 blue sst">${sst}</h6>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row minv px-2">
    <div class="col blue">
        <i class="fa fa-map-marker yellow"></i>&nbsp;<span class="cn ssc">${ssc}</span>
    </div>
    <div class="col-auto gray-text">
        <i class="wi wi-sunrise yellow"></i>&nbsp;<span class="srt">${srt}</span>
    </div>
    <div class="col-auto gray-text">
        <i class="wi wi-sunset yellow"></i>&nbsp;<span class="sst">${sst}</span>
    </div>
</div>
</div>`)
}

function formatTime(hours, minutes){
    var mer = "AM"
    if (hours>=12) {
        mer = "PM"
        hours-=12
    }
    if (hours==0) hours = 12
    if (minutes < 10) minutes = "0" + minutes
    return hours+":"+minutes+" "+mer
}

function revertTo(context){
    var city = $(context).find('.ciwt:first').html()
    setWeather(city)
}

function timer() {
    var currentTime = new Date()
    var tStr = formatTime(currentTime.getHours(), currentTime.getMinutes())
    $("#time").html(tStr)
    today = currentTime.getDay();
    var damo = currentTime.getDate()+' '+months[currentTime.getMonth()]
    var cdate = days[today]+', '+damo+', '+currentTime.getFullYear()
    $("#cdate").html(cdate)
    cdate = 'Today, '+damo
    $('#dcc').html(cdate)
    $('.weather-card').removeClass('current-day')
    $('#wi'+today).parent().addClass('current-day')
}

function setRainfall(){
    for(var i = 1; i<=12; ++i){
        var r = getRndInteger(5, 70)
        var s = getRndInteger(15, 90-r)
        $('#mr-bar-'+i).children('.rain-fill').css('height', r+'%')
        $('#mr-bar-'+i).children('.sun-fill').css('height', s+'%')
    }
}

function refreshAQI() {
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/air_pollution?lat='+lat+'&lon='+lon+'&appid='+apiKey
    }).done(function(airData){
        var values = airData.list[0]
        var comps = values.components
        aqi = values.main.aqi-1
        $('#aqr').html(aqRemarks[aqi])
        $('#aqd').html(aqDescs[aqi])
        $('.aqa').css('color', aqColors[aqi])
        $('.air-card').css({'color':aqColors[aqi], 'background':aqBgc[aqi]})
        $('.air-card').hover(function(){
            $(this).css({'color':aqBgc[aqi], 'background':aqColors[aqi]})
        }, function(){
            $(this).css({'color':aqColors[aqi], 'background':aqBgc[aqi]})
        })
        for(var i = 0; i<acTags.length; ++i){
            $('#ac'+i).html(comps[acTags[i]].toFixed(2))
        }
    })
}

function setCardData(){
    for(var i = 0; i<3; ++i){
        var x;
        for(x in cityData[i])
            $('#'+x+i).html(cityData[i][x])
    }
}


function setWeather(city) {
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/forecast/daily?q='+city+'&appid='+apiKey
    }).done(function(data){
        var value = data.list[0]
        cityName = data.city.name
        var il = 'images/w-gfx/'+value.weather[0].icon+'.png'  
        $('.city').html(cityName)
        $('#wic').attr('src', il)
        $('#wrc').html(value.weather[0].main)
        var temp = Math.round(value.temp.max - 273.15)      
        var ind = cities.indexOf(cityName)
        datum = {'wc':cityName, 'wit':temp+'°', 'ws':value.speed.toFixed(2)+'km/h', 'hm':value.humidity+'%'}
        if(ind==-1) {
            cities.pop()
            cities.unshift(cityName)
            cityData.pop()
            cityData.unshift(datum)
        } else{
            for(var i = 0; i<ind; ++i){
                var d = cityData.shift()
                cityData.push(d)
                var c = cities.shift()
                cities.push(c)
            }
            cities.shift()
            cityData.shift()
            cities.unshift(cityName)
            cityData.unshift(datum)
        }
        setCardData()
        var suri = new Date(value.sunrise * 1e3)
        suri = formatTime(suri.getHours(), suri.getMinutes())
        var suse = new Date(value.sunset * 1e3)
        suse = formatTime(suse.getHours(), suse.getMinutes())

        var ss = $('#sunrise-sunset')

        if($('#sunrise-sunset').children().length>10) ss.children().eq(1).remove()
        ss.append(newDiv(cityName, suri, suse))

        for(var i = 0; i<7; ++i) {
            var value = data.list[i]
            var temp = Math.round(value.temp.max - 273.15)
            var il = 'images/w-gfx/'+value.weather[0].icon+'.png'
            $("#wt"+(i+today)%7).html(temp+'°')
            $("#wi"+i).attr('src', il)
        }
        lat = data.city.coord.lat
        lon = data.city.coord.lon
        refreshAQI()
        setRainfall()
    })
}

function search(){
    var city = $('#searchCity').val()
    $('#searchCity').val('')
    setWeather(city)
}

$(document).ready(function() {
    timer()
    setInterval(timer, 10000)
    setWeather(cityName)
    $("#searchCity").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13)
            $('#sb').click()
    })

    $('#sunrise-sunset').append(newDiv('Kolkata (Sample)', '6:00 AM', '7:00 PM'))
    $('#sunrise-sunset').append(newDiv('Dhaka (Sample)', '6:30 AM', '7:40 PM'))
    $('.cdy').click()
    $('#sunrise-sunset').append(newDiv('Dispur (Sample)', '7:00 AM', '7:30 PM'))
    $('#sunrise-sunset').append(newDiv('Tokyo (Sample)', '8:00 AM', '7:50 PM'))
})