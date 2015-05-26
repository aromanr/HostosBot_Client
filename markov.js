// Holds the state information
var cache = 
{
    '_START': []
};

//Gets the corpus to generate the text.
function getCorpus() {
    // create a deferred object
    var r = $.Deferred();

    if($( "#myselect" ).val() == "1"){
        $.get('antologia.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "2"){
        $.get('cartas.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "3"){
        $.get('laCunaDeAmerica.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "4"){
        $.get('diarioTomo1y2.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "5"){
        $.get('hombreEIdeas.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "6"){
        $.get('jeografiaEvolutiva.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "7"){
        $.get('leccionesDeDerechos.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "8"){
        $.get('madreIsla.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "9"){
        $.get('meditando.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "10"){
        $.get('miViajeAlSur.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "11"){
        $.get('moralSocial.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "12"){
        $.get('paginasIntimas.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "13"){
        $.get('laPeregrinacion.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "14"){
        $.get('temasCubanos.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "15"){
        $.get('temasSudamericanos.txt', function(data) { addToCache(data); });
    }
    else if($( "#myselect" ).val() == "16"){
        $.get('tratadoDeSociologia.txt', function(data) { addToCache(data); });
    }else if($( "#myselect" ).val() == "17"){
        $.get('Chopra.txt', function(data) { addToCache(data); });
    }
    setTimeout(function () {
    // and call `resolve` on the deferred object, once you're done
    r.resolve();
    }, 100);

    // return the deferred object
  return r;
}

function generate(){
    getCorpus().done(generateHostos);
}
 
// Writes to the output textbox
function set(v) {
    //If by any chance the string is damaged, call the function again and generate a new one.
    if((v === undefined) || (v === "")){
        generateHostos();
    } 
    else{
        document.getElementById('out').value = v;
    }
}
 

//Adds the corpus to a cached variable
function addToCache(corpus) 
{
    //Let's clean the corpus from any random special characters
    var cleanCorpus = corpus.replace(/[&\/\\#+()$~%":;*<>{}Â«»\-]/g, '');
    // Get the clean corpus and split it into words
    var rope = cleanCorpus.split(/\s+/g);
    
    //If the text array is empty, end this function.
    if (!rope.length){return;}

    //If there is any word completely in upper case, make it lower to make it look natural
    for(i=0; i<rope.length; i++)
    {
        if(rope[i] === rope[i].toUpperCase())
        {
            rope[i] = rope[i].toLowerCase();
        }
    }
 
    // Add it to the start node's list of possibility
    cache['_START'].push(rope[0]);
    
    // Now go through each word and add it to the previous word's node
    for (var i = 0; i < rope.length - 1; i++) 
    {
        if (!cache[rope[i]])
        {
            cache[rope[i]] = [];
        }
            
        cache[rope[i]].push(rope[i + 1]);
        
        // If it's the beginning of a sentence, add the next word to the start node too
        if (rope[i].match(/\.$/))
        {
          cache['_START'].push(rope[i + 1]);
        } 
    }
}
 
function generateHostos() {

    // Start with the root node
    var currentWord = '_START';
    var str = '';
    
    // Generate at least 50 words plus N random words from 1 - 100
    var N = Math.floor((Math.random() * 100) + 1);
    for (var i = 0; i < N+50; i++) 
    {
        // Follow a random node, append it to the string, and move to that node
        var rand = Math.floor(Math.random() * cache[currentWord].length);
        str += cache[currentWord][rand];
        currentWord = cache[currentWord][rand];
        str += ' ';
    }

    //Let's add a little logic to the string to avoid weird punctuation.
    var finalEditString = finalEdit(str.substring(0, str.lastIndexOf(".")+1));

    set(finalEditString.body);
    clearCache();
    return finalEditString;
}

//Recieves the output string generated and takes care of punctuation.
function finalEdit(str){

    var breakAtSpace = str.split(/\s+/g);
    var hasQues = false;
    var hasEx = false;
    var endOfSen = false;
    var replacement = "";

    //console.log(breakAtSpace);
    breakAtSpace[0] = capFirst(breakAtSpace[0]);

    for(i=0; i<breakAtSpace.length -1; i++){
        if(startsWithQuestion(breakAtSpace[i])){
            hasQues = true;
        }
        if(startsWithExclamation(breakAtSpace[i])){
            hasEx = true;
        }
        if(endOFSentence(breakAtSpace[i])){
            endOfSen = true;
            breakAtSpace[i+1] = capFirst(breakAtSpace[i+1]);
        }
        
        if (hasQues && endOfSen) {
            if(((breakAtSpace[i].slice(-1) === "\!") || (breakAtSpace[i].slice(-1) === "\."))){
                replacement = breakAtSpace[i].replaceAt(breakAtSpace[i].length-1, "\?");
                breakAtSpace[i] = replacement;
                hasQues = false;
                endOfSen = false;
            }
            else if((breakAtSpace[i].slice(-1) === "\?")){
                hasQues = false;
                endOfSen = false;
            }
        }
        else if (hasEx && endOfSen) {
            if(((breakAtSpace[i].slice(-1) === "\?") || (breakAtSpace[i].slice(-1) === "\."))){
                replacement = breakAtSpace[i].replaceAt(breakAtSpace[i].length-1, "\!");
                breakAtSpace[i] = replacement;
                hasEx = false;
                endOfSen = false;
            }
            else if((breakAtSpace[i].slice(-1) === "\!")){
                hasEx = false;
                endOfSen = false;
            }
        }
        else if (!(hasEx || hasQues) && endOfSen) {
            if(((breakAtSpace[i].slice(-1) === "\?") || (breakAtSpace[i].slice(-1) === "\!")) && (breakAtSpace[i].slice(-1) !== "\.") ){
                replacement = breakAtSpace[i].replaceAt(breakAtSpace[i].length-1, ".");
                breakAtSpace[i] = replacement;
                hasEx = false;
                hasQues = false;
                endOfSen = false;
            }
        }

    }
    var body = breakAtSpace.join(" ");
    var source = "\r\n(fuente: " + $( "#myselect option:selected" ).text() + ")";
    body += source;
    var fin = {title: source, body: body};
    return fin;
}

function startsWithQuestion(string){
    if(string === undefined){
        return;
    }
    else if(string.indexOf("\xBF") === 0){
        return true;
    }
    else {return false;}
}

function startsWithExclamation(string){
    if(string === undefined){
        return;
    }
    else if(string.indexOf("\xA1") === 0){
        return true;
    }
    else {return false;}
}

function endOFSentence(string){
    if(string === undefined){
        return;
    }
    else if((string.indexOf(".") === string.length-1) || (string.indexOf("\!") === string.length-1) || (string.indexOf("\?") === string.length-1)){
        return true;
    }
    else {return false;}
}

function clearCache(){
    cache = null;
    delete cache;
    cache = { '_START': [] };
}

function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//This function is to process the string replacement. 
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}



//$(".bqQuoteLink > a").each(function(t, i){console.log($(i).text())})
