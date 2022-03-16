const sheetId = "17r0UCxbAEQymmxPJEQqTP-mTwLwT-AsODmEeqxlJzVU";

const {google} = require('googleapis');

//Please Create a Google credential by yourself
//Instruction: https://www.section.io/engineering-education/google-sheets-api-in-nodejs/

async function detect(){

    const auth = new google.auth.GoogleAuth({
            keyFile: "./credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets", 
    });

    const authClient = await auth.getClient();

    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClient });

    const sheetData = await googleSheetsInstance.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId: sheetId,
        range: "Form Responses 1!B:C"
    });
    
    let rawData = sheetData.data.values;
    //Remove the title array
    rawData.shift();
    const coorToDiscord = new Map();

    rawData.forEach((element) => {
        if(element.length > 1){
            coorToDiscord.set(element[1], element[0]);
        }
    })

    console.log(coorToDiscord)

}


(async ()=>{
    await detect();
})()



