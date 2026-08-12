/* ==========================================
   TREND STUDIO 2026
   PART 1
========================================== */

/* ==========
THEME SWITCH
========== */

const themeBtn = document.querySelector(
"#themeBtn, #themeSwitch, .theme-toggle"
);


if(themeBtn){

    themeBtn.addEventListener("click",()=>{

        document.body.classList.toggle("dark");

    });

}


/* ==========
SIDEBAR
========== */

const menuBtn = document.getElementById("menuBtn");

const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});

/* ==========================================
   PART 2
   SELECTION ENGINE
========================================== */


/* ==========
TOOLS
========== */

let selectedTool = "Phrases";

const tools = document.querySelectorAll(".tool");

tools.forEach(tool => {

    tool.addEventListener("click", () => {

        tools.forEach(btn => {

            btn.classList.remove("active");

        });

        tool.classList.add("active");

        selectedTool = tool.textContent.trim();

        document.getElementById("pageTitle").textContent =
            "Generate " + selectedTool;

    });

});



/* ==========
PLATFORM
========== */

let selectedPlatform = "X";

const platformButtons =
document.querySelectorAll("#platformGroup button");

platformButtons.forEach(button => {

    button.addEventListener("click", () => {

        platformButtons.forEach(btn => {

            btn.classList.remove("selected");

        });

        button.classList.add("selected");

        selectedPlatform =
        button.textContent.trim();

    });

});



/* ==========
POST TYPE
========== */

let selectedPostType = "Post";

const postButtons =
document.querySelectorAll("#typeGroup button");

postButtons.forEach(button => {

    button.addEventListener("click", () => {

        postButtons.forEach(btn => {

            btn.classList.remove("selected");

        });

        button.classList.add("selected");

        selectedPostType =
        button.textContent.trim();

    });

});


/* ==========================================
   PART 3
   URL MANAGER
========================================== */

const urlContainer =
document.getElementById("urlContainer");

const addUrlBtn =
document.getElementById("addUrlBtn");



let urlNumber = 0;



addUrl();



addUrlBtn.addEventListener("click", () => {

    addUrl();

});



function addUrl(value = "") {

    urlNumber++;

    const row =
    document.createElement("div");

    row.className = "url-row";

    row.innerHTML = `

        <input
        type="text"
        class="url-input"
        placeholder="Target X Post URL ${urlNumber}"
        value="${value}">

        <button
        type="button"
        class="remove-url">

        ✕

        </button>

    `;

    urlContainer.appendChild(row);



    const removeBtn =
    row.querySelector(".remove-url");



    removeBtn.addEventListener("click", () => {

        if (urlContainer.children.length === 1) {

            row.querySelector(".url-input").value = "";

            return;

        }

        row.remove();

    });

}

/* ==========================================
   PART 4
   GENERATOR ENGINE (POST / REPLY / QUOTE)
========================================== */


const generateBtn =
document.getElementById("generateBtn");


const results =
document.getElementById("resultsContainer");


let generatedLinks = [];



if(generateBtn){

generateBtn.addEventListener(
"click",
generateCampaign
);

}



function generateCampaign(){


generatedLinks = [];

results.innerHTML = "";



const campaign =
document.getElementById("campaignInput")
.value.trim();



const keywords =
document.getElementById("keywordInput")
.value.trim();



const linkAmount =
Number(
document.getElementById("linkCount").value
);



if(!campaign){

alert("Enter Campaign Name");

return;

}



const urls=[];


document.querySelectorAll(".url-input")
.forEach(input=>{

if(input.value.trim()){

urls.push(
input.value.trim()
);

}

});




for(let i=0;i<linkAmount;i++){


let target="";



if(
selectedPostType==="Reply" ||
selectedPostType==="Quote"
){


if(urls.length===0){

alert(
"Add target URL for this action"
);

return;

}


target =
urls[i % urls.length];


}



const text =
createReply(
campaign,
keywords,
i
);



const link =
createIntent(
target,
text
);



generatedLinks.push({

id:i+1,

target:target,

reply:text,

link:link,

done:false

});


}



displayResults();

updateProgress();


}






function createReply(
campaign,
keywords,
index
){


const templates=[


`${campaign} is coming soon!\n\n${keywords}`,


`Support ${campaign} and let's make it unforgettable!\n\n${keywords}`,


`Everyone is excited for ${campaign}!\n\n${keywords}`,


`The wait for ${campaign} begins now!\n\n${keywords}`,


`${campaign} deserves all the love and support!\n\n${keywords}`


];


return templates[
index % templates.length
];


}






function createIntent(
target,
text
){


if(selectedPostType==="Post"){


return (
"https://twitter.com/intent/tweet?text="
+
encodeURIComponent(text)
);


}



if(selectedPostType==="Reply"){


return (

"https://twitter.com/intent/tweet?in_reply_to="
+
target.split("/").pop()
+
"&text="
+
encodeURIComponent(text)

);


}



if(selectedPostType==="Quote"){


return (

"https://twitter.com/intent/tweet?url="
+
encodeURIComponent(target)
+
"&text="
+
encodeURIComponent(text)

);


}



return "";

}





/* ==========================================
   PART 5
   RESULTS + ACTIONS
========================================== */


function displayResults(){


results.innerHTML="";



generatedLinks.forEach(item=>{


const card=document.createElement("div");


card.className="result-card";



card.innerHTML=`

<h4>
${selectedPostType} #${item.id}
</h4>


<p class="link-type">

${selectedPlatform}
-
${selectedPostType}

</p>



<div class="result-actions">


<button class="launch-btn">
Launch
</button>


<button class="copy-btn">
Copy
</button>


<button class="done-btn">
Done
</button>


</div>

`;



card.querySelector(".launch-btn")
.onclick=()=>{

const link = item.link;

window.location.href = link;

};



card.querySelector(".copy-btn")
.onclick=()=>{


navigator.clipboard.writeText(
item.link
);


card.querySelector(".copy-btn")
.innerText="Copied";


setTimeout(()=>{

card.querySelector(".copy-btn")
.innerText="Copy";

},1500);


};




card.querySelector(".done-btn")
.onclick=()=>{


item.done=true;


card.classList.add(
"completed"
);


card.querySelector(".done-btn")
.innerText="Completed";


updateProgress();


};



results.appendChild(card);


});


}







/* ==========================================
   COPY ALL BUTTON
========================================== */


const copyAllBtn =
document.querySelector(
".copy-all"
);



if(copyAllBtn){


copyAllBtn.onclick=()=>{


const allLinks =

generatedLinks
.map(item=>item.link)
.join("\n\n");



navigator.clipboard.writeText(
allLinks
);



copyAllBtn.innerText=
"Copied";


setTimeout(()=>{


copyAllBtn.innerText=
"Copy All Intent Links";


},1500);


};


}






/* ==========================================
   PART 6
   PROGRESS
========================================== */


function updateProgress(){


const total =
generatedLinks.length;



const completed =
generatedLinks.filter(
item=>item.done
).length;



const percent =
total===0
?0
:(completed/total)*100;



const progressBox =
document.getElementById(
"progressBox"
);



if(progressBox){


progressBox.innerHTML=`

<p>
Completed:
${completed}/${total}
</p>


<div class="progress-bar">

<div style="width:${percent}%">

</div>

</div>

`;

}


}






/* ==========================================
   PART 7
   RESET CAMPAIGN
========================================== */


const clearBtn =
document.getElementById(
"clearBtn"
);



if(clearBtn){


clearBtn.onclick=()=>{


generatedLinks=[];


document.getElementById(
"campaignInput"
).value="";


document.getElementById(
"keywordInput"
).value="";



document.querySelectorAll(".url-input")
.forEach((input,index)=>{


if(index===0){

input.value="";

}else{

input.closest(".url-row").remove();

}


});



results.innerHTML="";


const progressBox =
document.getElementById(
"progressBox"
);


if(progressBox){

progressBox.innerHTML="";

}


};


}
