
var pQueueBig=[];
var readyQueue=[];
var time=0;
var quantum=2;

function add(){

    pQueueBig[pQueueBig.length]={
        name:$("#AddpName").val(),
        burst:$("#AddbTime").val(),
        arrival:$("#Addarrival").val(),
        pColour:$("#pColour").val(),
        runtime:0,
        total:0,
        availability:true,
    };

    var item=pQueueBig[pQueueBig.length-1];
    var row1="<td>"+item.name+"</td>";
    var row2="<td>"+item.burst+"</td>";
    var row3="<td>"+item.arrival+"</td>";
    var row4="<td><canvas style=\"background: "+item.pColour+";height:30px;width:60px; border: solid;\"></canvas></td>"
    var row5="<td> <button class=\"btn btn-danger\" onclick='removeProcess("+(pQueueBig.length-1)+")'>Remove</button></td>";

    $("#iProcessTbl").append("<tr id=\"trele\">"+row1+row2+row3+row4+row5+"</tr>");
   // $("#td").text(item.name+" "+ item.burst+ " " + item.arrival);
}

let shedule = async () => {

    $("#_sim").empty();
    await timeout(500);
    time=0;

    // var pQueue = JSON.parse(JSON.stringify(pQueueBig));
    var pQueue=[];
    for(var i=0;i<pQueueBig.length;i++){
        if (pQueueBig[i].availability==false)continue;
        pQueue[pQueue.length]=pQueueBig[i];
    }
    pQueue.sort((a, b) => (a.arrival > b.arrival) ? 1 : -1);

    // console.log("started");
    // console.log(pQueue);

    while(pQueue.length>0 || readyQueue.length>0){

        time=time+1;
        console.log(time);

        while(pQueue.length>0 && pQueue[0].arrival<=time){
            readyQueue.push(pQueue.shift());
        }

        while(readyQueue.length>0 && readyQueue[0].total>=readyQueue[0].burst){
            readyQueue.shift();
        }

        while(readyQueue.length>0 && readyQueue[0].runtime>=quantum){
            readyQueue[0].runtime=0;
            var tmp=readyQueue.shift();
            readyQueue.push(tmp);
        }

        if(pQueue.length==0 && readyQueue.length==0)break;


        if(readyQueue.length>0){
            readyQueue[0].runtime+=1;
            readyQueue[0].total+=1;
            addItem(readyQueue[0].pColour);
            // console.log("running"+readyQueue[0].name)
        }
        else{
            addItem("white");
        }


        await timeout(1000);

        // Display the current process

    }
    console.log("stopped");
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addItem(clr) {
    console.log("adding");
    // $("#sim").append("<canvas>\n" +
    //     "    <canvas style=\"background:#98bf21;height:100px;width:100px;position:relative;border:solid;\"></canvas>\n" +
    //     "   <br> <canvas style=\"background:red;height:100px;width:100px;position:relative;border:solid;\"></canvas>\n" +
    //     "</canvas>");

    $("#_sim").append("<div class=\"tooltip1\" >\n" +
        "            <canvas style=\"display:block;background:"+clr+";height:75px;width:50px;position:relative;border:solid;\"></canvas>\n" +
        "<span class=\"tooltiptext1\">Tooltip text</span>"+
        "<h2 style=\"display:block;background:red;height:50px;width:50px;position:relative;border:solid; text-align: center;\">"+time+"</h2>"+
        "        </div>");

}

function reset(){
    pQueueBig=[];
    $("#iProcessTbl").empty();
    $("#iProcessTbl").append("<tr>\n" +
        "            <th>Process Name</th>\n" +
        "            <th>Burst Time</th>\n" +
        "            <th>Arrival Time</th>\n" +
        "            <th>Colour</th>\n" +
        "            <th></th>\n" +
        "        </tr>");
    $("#_sim").empty();
}

function removeProcess(procesid){
    $("#iProcessTbl").empty();
    $("#iProcessTbl").append("<tr>\n" +
        "            <th>Process Name</th>\n" +
        "            <th>Burst Time</th>\n" +
        "            <th>Arrival Time</th>\n" +
        "            <th>Colour</th>\n" +
        "            <th></th>\n" +
        "        </tr>");

    pQueueBig[procesid].availability=false;

    var i=0;
    for(i=0;i<pQueueBig.length;i++){
        var item=pQueueBig[i];

        if(item.availability==false)continue;

        var row1="<td>"+item.name+"</td>";
        var row2="<td>"+item.burst+"</td>";
        var row3="<td>"+item.arrival+"</td>";
        var row4="<td><canvas style=\"background: "+item.pColour+";height:30px;width:60px; border: solid;\"></canvas></td>"
        var row5="<td> <button class=\"btn btn-danger\" onclick='removeProcess("+(i)+")'>Remove</button></td>";

        $("#iProcessTbl").append("<tr id=\"trele\">"+row1+row2+row3+row4+row5+"</tr>");
    }


}
$(function () {
    $('#cp1')
        .colorpicker({
            inline: true,
            container: true,
            extensions: [
                {
                    name: 'swatches',
                    options: {
                        colors: {
                            'tetrad1': '#000',
                            'tetrad2': '#000',
                            'tetrad3': '#000',
                            'tetrad4': '#000'
                        },
                        namesAsValues: false
                    }
                }
            ]
        })
        .on('colorpickerChange colorpickerCreate', function (e) {
            var colors = e.color.generate('tetrad');

            colors.forEach(function (color, i) {
                var colorStr = color.string(),
                    swatch = e.colorpicker.picker
                        .find('.colorpicker-swatch[data-name="tetrad' + (i + 1) + '"]');

                swatch
                    .attr('data-value', colorStr)
                    .attr('title', colorStr)
                    .find('> i')
                    .css('background-color', colorStr);
            });
        });
});
