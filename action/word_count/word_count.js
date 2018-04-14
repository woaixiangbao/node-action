var fs = require('fs');
var completedTasks = 0;
var tasks = []
var wordCounts = {}
var fileDir = './text'
function checkIfComplete(){
    completedTasks++;
    if(completedTasks == tasks.length){
        for(var index in wordCounts){
            console.log(index + ': ' + wordCounts[index]);
        }
    }
}

