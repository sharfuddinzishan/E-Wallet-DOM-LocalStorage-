const header = document.getElementById('header');
const totalBalance = document.getElementById('totalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpenses = document.getElementById('totalExpenses');
const transactionType = document.getElementById('transactionType');
const transactionNote = document.getElementById('transactionNote');
const transactionAmount = document.getElementById('transactionAmount');
const transactionSubmit = document.getElementById('transactionSubmit');
const transactionHistory = document.getElementById('transactionHistory');

transactionSubmit.addEventListener('click', invokeTransaction);

function invokeTransaction() {
    let typeInput = parseInt(transactionType.value);
    let noteInput = transactionNote.value;
    let amountInput = parseInt(transactionAmount.value);
    if (!noteInput || amountInput <= 0) {
        return
    }
    // walletParse = JSON.parse(getWallet());
    // statementParse = JSON.parse(getStatement());

    updateWallet(walletParse, typeInput, amountInput);
    updateStatement(statementParse, typeInput, amountInput, noteInput, new Date().toUTCString())
    balanceSectionUpdate(walletParse);
    statementSectionUpdate(statementParse);
}

let getWallet = () => {
    if (localStorage.getItem("wallet"))
        return localStorage.getItem("wallet");
    else {
        const walletInfo = {
            income: 0,
            expense: 0,
            balance: 0
        };
        localStorage.setItem('wallet', JSON.stringify(walletInfo));
        return localStorage.getItem("wallet");
    }
}
let updateWallet = (walletObj, actionType, amountGiven) => {
    if (actionType) {
        walletObj.income += amountGiven;
        walletObj.balance = walletObj.income - walletObj.expense;
    }
    else {
        walletObj.expense += amountGiven;
        walletObj.balance = walletObj.income - walletObj.expense;
    }
    localStorage.setItem('wallet', JSON.stringify(walletObj));
    // return walletObj;
}
let balanceSectionUpdate = walletObj => {
    let { income, expense, balance } = walletObj;
    totalBalance.innerText = balance;
    totalIncome.innerText = income;
    totalExpenses.innerText = expense;
}
let getStatement = () => {
    if (localStorage.getItem("statement"))
        return localStorage.getItem("statement");
    else {
        const statementInfo = [];
        localStorage.setItem('statement', JSON.stringify(statementInfo));
        return localStorage.getItem("statement");
    }
}
let updateStatement = (statementsArray, typeTransaction, amountRequest, textSummary, triggerTime) => {
    let statementObj = {};
    statementObj.summary = textSummary;
    statementObj.time = triggerTime;
    statementObj.amount = amountRequest;
    statementObj.type = typeTransaction == 1 ? '+' : '-';
    statementsArray.unshift(statementObj);
    localStorage.setItem('statement', JSON.stringify(statementsArray));
    // return statementsArray;
}
let statementSectionUpdate = statementsArray => {
    transactionHistory.innerHTML = "";
    statementsArray.forEach(statement => {
        let listItem = document.createElement('li');
        listItem.className = "list-group-item list-group-item-action text-break";
        listItem.innerHTML = `
            <div class="d-flex flex-column flex-sm-row justify-content-between">
                <h5 class="mb-1 fw-bold">${statement.summary}</h5>
                <small class="text-danger fw-bold fs-3">${statement.type + '$' + statement.amount}</small>
            </div>
            <small class="text-muted">${statement.time}</small>
            `
        transactionHistory.appendChild(listItem);
    });
}

let walletParse = JSON.parse(getWallet());
let statementParse = JSON.parse(getStatement());
balanceSectionUpdate(walletParse);
statementSectionUpdate(statementParse);