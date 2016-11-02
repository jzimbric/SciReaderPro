var main = function () {
    "use strict";
// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.

$("html").click(function(e){
  console.log(e.target);
});

$("section").click(function(){
  $("main").css("background-color", "white");
});
function Hilitor(id, tag)
{

  var targetNode = document.getElementById(id) || document.body;
  var hiliteTag = tag || "EM";
  var skipTags = new RegExp("^(?:" + hiliteTag + "|SCRIPT|FORM|SPAN)$");
  var colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
  var wordColor = [];
  var colorIdx = 0;
  var matchRegex = "";
  var openLeft = false;
  var openRight = false;

  this.setMatchType = function(type)
  {
    switch(type)
    {
      case "left":
        this.openLeft = false;
        this.openRight = true;
        break;
      case "right":
        this.openLeft = true;
        this.openRight = false;
        break;
      case "open":
        this.openLeft = this.openRight = true;
        break;
      default:
        this.openLeft = this.openRight = false;
    }
  };

  this.setRegex = function(input)
  {
    input = input.replace(/^[^\w]+|[^\w]+$/g, "").replace(/[^\w'-]+/g, "|");
    input = input.replace(/^\||\|$/g, "");
    if(input) {
      var re = "(" + input + ")";
      if(!this.openLeft) re = "\\b" + re;
      if(!this.openRight) re = re + "\\b";
      matchRegex = new RegExp(re, "i");
      return true;
    }
    return false;
  };

  this.getRegex = function()
  {
    var retval = matchRegex.toString();
    retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, "");
    retval = retval.replace(/\|/g, " ");
    return retval;
  };

  // recursively apply word highlighting
  this.hiliteWords = function(node)
  {
    if(node === undefined || !node) return;
    if(!matchRegex) return;
    if(skipTags.test(node.nodeName)) return;

    if(node.hasChildNodes()) {
      for(var i=0; i < node.childNodes.length; i++)
        this.hiliteWords(node.childNodes[i]);
    }
    if(node.nodeType == 3) { // NODE_TEXT
        var nv;
        var regs;
      if((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
        if(!wordColor[regs[0].toLowerCase()]) {
          wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
        }

        var match = document.createElement(hiliteTag);
        match.appendChild(document.createTextNode(regs[0]));
        match.style.backgroundColor = wordColor[regs[0].toLowerCase()];
        match.style.fontStyle = "inherit";
        match.style.color = "#000";

        var after = node.splitText(regs.index);
        after.nodeValue = after.nodeValue.substring(regs[0].length);
        node.parentNode.insertBefore(match, after);
      }
    };
  };

  // remove highlighting
  this.remove = function()
  {
    var arr = document.getElementsByTagName(hiliteTag);
    var el;
    while(arr.length && (el = arr[0])) {
      var parent = el.parentNode;
      parent.replaceChild(el.firstChild, el);
      parent.normalize();
    }
  };

  // start highlighting at target node
  this.apply = function(input)
  {
    this.remove();
    if(input === undefined || !input) return;
    if(this.setRegex(input)) {
      this.hiliteWords(targetNode);
    }
  };

}
/*    $(".comment-input button").on("click", function(event) {
      var $new_comment;
        
        
        if ($(".comment-input input").val() !== "") {
            
        
             $new_comment = $("<p>").text($(".comment-input input").val());
             $new_comment.hide();
        
              $(".comments").append($new_comment);
              $new_comment.fadeIn();
              $(".comment-input input").val("");

        }
    });
    
    $(".comment-input input").on("keypress", function (event) {
      var $new_comment;
        
        if (event.keyCode == 13) {
            if ($(".comment-input input").val() !== "") {
                var $new_comment = $("<p>").text($(".comment-input input").val());
                $new_comment.hide();
                
                $(".comments").append($new_comment);
                $new_comment.fadeIn();
                $(".comment-input input").val("");
            }
        }
  */
  var vocabList = [];

    $(".clickable").on("click", function(e){
         var s = window.getSelection();
         var range = s.getRangeAt(0);
         var node = s.anchorNode;
         while(range.toString().indexOf(' ') != 0) {                 
            range.setStart(node,(range.startOffset -1));
         }
         range.setStart(node, range.startOffset +1);
         do{
           range.setEnd(node,range.endOffset + 1);

        }while(range.toString().indexOf(' ') == -1 && range.toString().trim() != '');
        var str = range.toString().trim();
        var myHilitor = new Hilitor(".clickable");
        myHilitor.apply(str);
        var $newWord = $('<p class="vocab"></p>').text(str);
       $(".new-words").append($newWord);
       $newWord.click(function(e){
        $(this).hide();
        vocabList.pop($newWord);
       });
      $(".new-words").append(" ");
        
        vocabList.push($newWord);
        //console.log(vocabList);
       });
   function displayContent(divs){ 
    var a = [];
    for (var i=0;i < divs.length; i++){
      a.push(divs[i].innerHTML );
    }
  }
  var clickables = $(".clickable").toArray();
  console.log(clickables);

};

$(document).ready(main);