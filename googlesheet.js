const sheetId = "1QATREWSPHsCLnsVxe8rr1INxus94w8cBHr2SN1WVqjs";
const {google} = require('googleapis');
const Query = require('./query.js');

//Please Create a Google credential by yourself
//Instruction: https://www.section.io/engineering-education/google-sheets-api-in-nodejs/
const {client_email: email, private_key: key} = require('./credentials.json');

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];


async function detect(){

    const epoch1 = [];
    const epoch1BlackList = [];
    const epoch2 = [];
    const epoch2BlackList = [];

    const auth = new google.auth.GoogleAuth({
            keyFile: "./credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets", 
    });

    const authClient = await auth.getClient();

    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClient });

    await datahandler(authClient, googleSheetsInstance, "Epoch 1!B:B", epoch1, true);
    await datahandler(authClient, googleSheetsInstance, "Epoch 1 Blacklist!B:B", epoch1BlackList, false);
    await datahandler(authClient, googleSheetsInstance, "Epoch 2!C:C", epoch2, true);
    await datahandler(authClient, googleSheetsInstance, "Epoch 2 Blacklist!C:C", epoch2BlackList, false);

}

async function datahandler(auth, googleSheets, range, array, flag){
    
    const data = await googleSheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: sheetId,
        range: range
    });

    data.data.values.forEach(element => {
        array.push(element[0]);
    });

    array.shift();

    let result;
    /* 
        Be good: From blacklist to good => With NFT now
        Be bad: From good to blacklist => Without NFT now
    */
    if (flag){
        //Be Bad
        result = (await Query.verify(array))
            .map((value, index) => [array[index], value.toString()])
            .filter((value) => value[1] == '0')
            .map((value) => ["",value[0], value[1]]);
    }else{
        //Be Good
        result = (await Query.verify(array))
            .map((value, index) => [array[index], value.toString()])
            .filter((value) => value[1] != '0')
            .map((value) => [value[0], "", value[1]]);
    }

    //Upload the result to 'History' Sheet of google doc
    await googleSheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: sheetId,
        range: "History!A:C",
        valueInputOption: "RAW",
        resource: {
            values: result
        }
    });
    
}

(async ()=>{
    await detect();
})()



