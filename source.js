const ssc = new SSC('https://api.hive-engine.com/rpc');

//these are functions to sort data 
function sortDataToNull (data) {
    let sortedData = [];
    for (i=0; i<data.length;i++){
        if (data[i].to == "null"){
           sortedData.push(data[i])
        }
    }
    return sortedData;
}

function sortDataNotToNull (data) {
    let balance = 0;
    for (i=0; i<data.length;i++){
        balance = parseInt(data[i].quantity) + balance
        if (data[i].to == "null"){
            break;
        }
    }
    console.log(balance)
    return balance;
}


async function lastBurnInfo (url) {
    //we fetch data from the api
    const budsResponse = await fetch (url);
    const budsData = await budsResponse.json();
    //we sort the data 
    const budsSortedData = sortDataToNull(budsData);
    const balances = sortDataNotToNull(budsData)
    
    const lastBurn = budsSortedData[0];
    const lastBurnTimestamp = lastBurn.timestamp*1000;
    const lastburnDate = new Date(lastBurnTimestamp);
  
    
    //we append elements in html
    const tableBody = document.getElementById("tablebody")
    const row = document.createElement("tr");
    row.id = `${lastBurn.account}`
    const accountCell = document.createElement("td");
    const lastBurnCell = document.createElement("td");
    const lastBurnDateCell = document.createElement("td");
    const balanceCell = document.createElement("td");
    accountCell.textContent = lastBurn.account;
    lastBurnCell.textContent = lastBurn.quantity;
    lastBurnDateCell.textContent = lastburnDate
    balanceCell.textContent = balances
    row.append(accountCell)
    row.append(lastBurnCell)
    row.append(lastBurnDateCell)
    row.append(balanceCell)
    tableBody.append(row)
    
}


//I just like them appearing one by one.

async function populateBalances() {
    await lastBurnInfo("https://history.hive-engine.com/accountHistory?account=hk-dev&limit=500&offset=0&symbol=BUDS")
    await lastBurnInfo("https://history.hive-engine.com/accountHistory?account=hk-nvault&limit=500&offset=0&symbol=BUDS")
    await lastBurnInfo("https://history.hive-engine.com/accountHistory?account=hk-forge&limit=500&offset=0&symbol=BUDS")
    await lastBurnInfo("https://history.hive-engine.com/accountHistory?account=hk-vault&limit=500&offset=0&symbol=BUDS")
    await lastBurnInfo("https://history.hive-engine.com/accountHistory?account=hashkings&limit=500&offset=0&symbol=BUDS")
    await lastBurnInfo("https://history.hive-engine.com/accountHistory?account=hk-bang&limit=500&offset=0&symbol=BUDS")   
}


populateBalances()
balances("null")



async function balances(account){
    const data = await  ssc.find('tokens', 'balances', {"symbol":"BUDS", "account":{"$eq":"null"}}, 1000, 0, [], (err, result) => {
        console.log(err, result);
        return(result);
    })  
    const burnedCell = document.getElementById("burnedCell")
    burnedCell.textContent = (data[0].balance)
}


//function to get balance through ssc query and append it to the tables//
// const ssc = new SSC('https://api.hive-engine.com/rpc');
// async function balances(account){
//     const data = await  ssc.find('tokens', 'balances', {"symbol":"BUDS", "account":{"$eq":`${account}`}}, 1000, 0, [], (err, result) => {
//         console.log(err, result);
//         return(result);
//     })  
//     console.log(data[0].balance);
//     const row = document.getElementById(account)
//     const balance = document.createElement("td")
//     balance.textContent = (data[0].balance)
//     row.append(balance)
// }
