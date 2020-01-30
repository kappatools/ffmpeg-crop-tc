var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var moment = require('moment');
var config = require('./config');

// console.dir(argv);
// todos - prompt for filename if none passed
//   -i arg to input text file with multiple crop points, output a shell file to the dir running the script 
//   add arg to actually run the ffmpeg command from this script, maybe console log print the command to run and ask for confirm before running  
//   can i copy output to clipboard and just paste and run? 
//   clipboard copy options to try - https://stackoverflow.com/questions/7778539/copy-to-clipboard-in-node-js
//  add -h help arg to print to console the format for input
//  auto bitrate -  get bitrate of original file (using ffmpeg or ffprobe) then determine output max bitrate relative to crop dimensions vs original 

//tc filename.mp4 00.25-01.10,01.30-02:05 crop 0 4 125 2955 1599 125 50
var tc = function(source,raw_timecode,mode,vid_num,quality,max_rate,width,height,left,top) {
//var source_file = process.argv[3];
var source_file = source;
//var time_arg = process.argv[4];
var time_arg = raw_timecode;


var encode_quality = config.encode_quality;
var max_rate = config.max_rate;
//var encode_quality = config.encode_quality;
//set defaults 
var edit_mode = mode || 'copy';
//var encode_quality = quality || 4; //default crf 4 unless another value passed 
//var max_rate = max_rate || 105
var width = width || 'width';
var height = height || 'height';
var top = top || 'top';
var left = left || 'left';
var vid_num = vid_num || 0; 

//console.log("original timecode string is: " + time_arg + " original filename is: " + source_file);
//console.log(x.split(,));
var output_line = "";

//string replace time_arg . for : and / for ,
time_arg = time_arg.replace(/\./g,":");
time_arg = time_arg.replace(/\//g,",");
console.log("time arg: " + time_arg);

//if no third arg assume copy, else crop 
//-crf 4 -filter:v "crop=2889:1183:944:283"

var file_full = source_file.split(/\.(?=[^\.]+$)/);
var filename = file_full[0];
var file_ext = file_full[1];
console.log('name is: ' + file_full[0] + ' extension is: ' + file_full[1]);

var current_timecode = [];
var time_array = time_arg.split(',');

for(var i = 0; i < time_array.length; i++)
{
   //console.log(str_array[i]);
   

   current_timecode = time_array[i].split('-');
   //console.log("start time: " + current_timecode[0] + " end time: " + current_timecode[1] ); 
   var start_time = current_timecode[0];
   var end_time = current_timecode[1];
   // if number of colons is only 1, prepend to start string 00: for hours handling 

   if((start_time.match(/:/g) || []).length == 1 ) {
   	start_time = "00:" + start_time;
   }

    if((end_time.match(/:/g) || []).length == 1 ) {
   	end_time = "00:" + end_time;
   }


//   var now  = "04/09/2013 15:00:00";
//	var then = "04/09/2013 14:20:30";

console.log("diff time: " + moment.utc(moment(end_time,"HH:mm:ss").diff(moment(start_time,"HH:mm:ss"))).format("HH:mm:ss"));
var diff_time = moment.utc(moment(end_time,"HH:mm:ss").diff(moment(start_time,"HH:mm:ss"))).format("HH:mm:ss");

var start_time_name = start_time.replace(/\:/g,"_");

if (edit_mode == 'copy'){

//-an to remove audio

console.log("ffmpeg -ss " + start_time + " -i " + source_file + " -t " + diff_time + " -c copy " + filename +  "(" + start_time_name + "_" + vid_num + ")." + file_ext +" && ");
output_line = output_line + "ffmpeg -ss " + start_time + " -i " + source_file + " -t " + diff_time + " -c copy " + filename +  "(" + start_time_name + "_" + vid_num + ")." + file_ext +" && ";

}else{ // if mode is crop
        //,quality,width,height,top,left
  console.log("ffmpeg -ss " + start_time + " -i " + source_file + " -t " + diff_time + " -crf " +  encode_quality + ' -maxrate ' + max_rate + 'M -bufsize 105M -filter:v "crop=' + width + ":" + height + ":" + top + ":" + left + '" ' + filename +  "(" + start_time_name + "_" + vid_num + ")." + file_ext + " && ");
  output_line = output_line + "ffmpeg -ss " + start_time + " -i " + source_file + " -t " + diff_time + " -crf " +  encode_quality + ' -maxrate ' + max_rate + 'M -bufsize 105M -filter:v "crop=' + width + ":" + height + ":" + top + ":" + left + '" ' + filename +  "(" + start_time_name + "_" + vid_num + ")." + file_ext + " && ";
}
vid_num++;
   // var res = Math.abs(end_time - start_time) / 1000;

   // var hours = Math.floor(res / 3600) % 24; 
   // var minutes = Math.floor(res / 60) % 60;  
   // var seconds = res % 60;
    console.log("start time is " + start_time + " end time is: " + end_time);
//    console.log("diff time hours: " + hours + " minutes: " + minutes + " seconds: " + seconds);

//endline for three beeps rundll32.exe cmdext.dll,MessageBeepStub && SLEEP 2 && rundll32.exe cmdext.dll,MessageBeepStub && SLEEP 2 && rundll32.exe cmdext.dll,MessageBeepStub

}
//ffmpeg -i "P:\cali2dump\5-4-18\g7\162_PANA\P1620093.MP4" -ss 00:00:00 -t 00:04:19 -crf 4 -filter:v "crop=2889:1183:944:283" C:\outputs\P1620093-bets_hube_cropped1.MP4  // far side court crop
//remove final 3 chars? for taking out trailing && 
output_line = output_line + "rundll32.exe cmdext.dll,MessageBeepStub && SLEEP 2 && rundll32.exe cmdext.dll,MessageBeepStub && SLEEP 2 && rundll32.exe cmdext.dll,MessageBeepStub && PAUSE"; 
//var wstream = fs.createWriteStream(filename + '-ffmpeg.txt');
//wstream.write(output_line);
console.log(output_line);
}
exports.tc = tc;