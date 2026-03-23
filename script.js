// 1. Sua tabela de dados (Mantida conforme sua estrutura)
const data = {
    express: { base: [15263, 19001, 23360, 28362, 32168, 36280, 40392], extra: 4112 },
    atlantic: { base: [3815, 4750, 5840, 7090, 8042, 9070, 10098], extra: 1028 },
    rural: { base: [10507, 13080, 16080, 19524, 22143, 24975, 27806], extra: 2831 }
};

// Valor de fallback caso a internet falhe ao buscar o dólar
let currentExchangeRate = 4.10; 

// 2. Busca a cotação real na API
async function getExchangeRate() {
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/last/CAD-BRL');
        const result = await response.json();
        
        // Captura o valor real da API
        currentExchangeRate = parseFloat(result.CADBRL.bid);
        
        // Referenciando EXATAMENTE o seu ID do HTML
        const exchangeElement = document.getElementById('header-info');
        const exchangeInfo = document.getElementById('exchange-info');


        if (exchangeElement) {
            // Atualiza o texto mantendo o seu padrão de escrita
            exchangeElement.innerText = `Exchange Rate: 1 CAD = ${currentExchangeRate.toFixed(2)} BRL`;
        }
        
        if (exchangeInfo) {
            exchangeInfo.innerText = `Exchange Rate: 1 CAD = ${currentExchangeRate.toFixed(2)} BRL`;
        }
        
        // Chama o cálculo para atualizar os cards com o valor novo
        calculate(); 

    } catch (error) {
        console.error("Erro ao buscar cotação. Usando valor fixo de 3.65.");
        // Opcional: Avisar no HTML que está offline
        document.getElementById('header-info').innerText = `Exchange Rate: 1 CAD = 3.65 BRL (Offline)`;
    }
}

// 3. A função principal que seu HTML chama (oninput="calculate()")
function calculate() {
    const inputPessoas = document.getElementById('familySize');
    let quantidade = parseInt(inputPessoas.value);

    // Se o campo estiver vazio ou for menor que 1, limpamos os valores
    if (isNaN(quantidade) || quantidade < 1) {
        zerarResultados();
        return;
    }

    // Percorre os 3 programas (express, atlantic, rural)
    Object.keys(data).forEach(programa => {
        let totalCAD = 0;

        // Lógica: Se até 7 pessoas, usa a lista. Se mais, soma o extra.
        if (quantidade <= 7) {
            totalCAD = data[programa].base[quantidade - 1];
        } else {
            const valorSetePessoas = data[programa].base[6];
            const extras = quantidade - 7;
            totalCAD = valorSetePessoas + (extras * data[programa].extra);
        }

        // Calcula o valor em Real
        let totalBRL = totalCAD * currentExchangeRate;

        // Atualiza os IDs val-programa e brl-programa no seu HTML
        const elCAD = document.getElementById(`val-${programa}`);
        const elBRL = document.getElementById(`brl-${programa}`);

        if (elCAD) elCAD.innerText = `CAD$ ${totalCAD.toLocaleString('en-CA')}`;
        if (elBRL) elBRL.innerText = `R$ ${totalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
    });
}

// Função para deixar os valores zerados se o input estiver vazio
function zerarResultados() {
    Object.keys(data).forEach(programa => {
        const elCAD = document.getElementById(`val-${programa}`);
        const elBRL = document.getElementById(`brl-${programa}`);
        if (elCAD) elCAD.innerText = "CAD$ 0";
        if (elBRL) elBRL.innerText = "R$ 0";
    });
}

// Inicia a busca da cotação assim que o script é lido
getExchangeRate();

const convertButton = document.querySelector(".convert-button")
convertButton.addEventListener("click", convertCurrency)

function convertCurrency() {
    const realValue = document.querySelector('#currentSavingsreal').value;
    const dollarValue = document.querySelector('#currentSavingsdollar');

    const dolarToday = currentExchangeRate; 

    const totalResult = realValue / dolarToday;

    dollarValue.value = "CAD$ "+ totalResult.toFixed(2);

} 

