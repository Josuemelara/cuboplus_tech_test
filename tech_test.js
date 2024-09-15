async function calculateBalances(address, balanceToShow) {
    const apiUrl = `https://mempool.space/api/address/${address}/txs/mempool`;
    const utxoUrl = `https://mempool.space/api/address/${address}/utxo`;

    try {
        // Hacer la solicitud a la API de mempool.space
        const response = await fetch(apiUrl);
        const transactions = await response.json();

        const responseOnChain = await fetch(utxoUrl);
        const utxos = await responseOnChain.json();

        let balance = 0;

        // Iterar a través de las transacciones en el mempool
        transactions.forEach(tx => {
            // Restar el valor de las entradas (vin) donde la dirección ha gastado
            tx.vin.forEach(input => {
                if (input.prevout && input.prevout.scriptpubkey_address === address) {
                    balance -= input.prevout.value; // Salida de fondos
                }
            });

            // Sumar el valor de las salidas (vout) donde la dirección ha recibido
            tx.vout.forEach(output => {
                if (output.scriptpubkey_address === address) {
                    balance += output.value; // Entrada de fondos
                }
            });
        });

        // Convertir satoshis a Bitcoin
        const balanceInBTC = balance / 1e8;
        
        //Balance on chain
        let balanceOnChain = 0;
        utxos.forEach(utxo => {
            balanceOnChain += utxo.value; // Los valores están en satoshis
        });

        // Convertir de satoshis a Bitcoin
        const balanceInBTCOnChain = balanceOnChain / 1e8;

        letAnyBalance = balanceToShow;
        switch(letAnyBalance){
        case 1:
            console.log(`Balance mempool confirmado para ${address}: ${balanceInBTC} BTC`);
            break;
        case 2:
            console.log(`Balance mempool confirmado para ${address}: ${balance} SATs`);
            break;
        case 3:
            console.log(`Balance on-chain confirmado para ${address}: ${balanceInBTCOnChain} BTC`);
            break;
        case 4:
            console.log(`Balance on-chain confirmado para ${address}: ${balanceOnChain} SATs`);
            break;
        default:
             console.log('Type one the following options for showing the balance accordingly:\n\
            - 1 for the mempool balance in bitcoin\n\
            - 2 for the mempool balance in SATs\n\
            - 3 for the balance on chain in bitcoin\n\
            - 4 for the balance on chain in SATs');
            break;
        }

    } catch (error) {
        console.error('Error al obtener alguno de los balance:', error);
    }
}

// Función principal para calcular la variación de balance en un determinado periodo de tiempo (dado en días)
async function calculateBalanceVariation(address, days) {
    const confirmedTxsUrl = `https://mempool.space/api/address/${address}/txs`;
    const mempoolTxsUrl = `https://mempool.space/api/address/${address}/txs/mempool`;

    try {
        // Obtener transacciones confirmadas
        const confirmedTxsResponse = await fetch(confirmedTxsUrl);
        const confirmedTxs = await confirmedTxsResponse.json();

        // Obtener transacciones en el mempool
        const mempoolTxsResponse = await fetch(mempoolTxsUrl);
        const mempoolTxs = await mempoolTxsResponse.json();

        // Obtener el tiempo actual y calcular el límite de los últimos n días
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const daysAgoTimestamp = currentTimestamp - (days * 24 * 60 * 60); // 30 días en segundos

        // Filtrar transacciones confirmadas en los últimos n días
        const recentConfirmedTxs = confirmedTxs.filter(tx => tx.status.block_time >= daysAgoTimestamp);

        // Inicializar balances
        let initialBalance = 0;
        let currentBalance = 0;

        // Función para procesar las transacciones y ajustar el balance
        function processTransactions(txs, isMempool = false) {
            txs.forEach(tx => {
                tx.vin.forEach(input => {
                    if (input.prevout && input.prevout.scriptpubkey_address === address) {
                        if (!isMempool && tx.status.block_time < daysAgoTimestamp) {
                            initialBalance -= input.prevout.value;  // Restar gasto inicial
                        }
                        currentBalance -= input.prevout.value;  // Restar gasto actual
                    }
                });

                tx.vout.forEach(output => {
                    if (output.scriptpubkey_address === address) {
                        if (!isMempool && tx.status.block_time < daysAgoTimestamp) {
                            initialBalance += output.value;  // Sumar entrada inicial
                        }
                        currentBalance += output.value;  // Sumar entrada actual
                    }
                });
            });
        }

        // Procesar transacciones confirmadas
        processTransactions(confirmedTxs);

        // Procesar transacciones en el mempool
        processTransactions(mempoolTxs, true);

        // Calcular la variación del balance
        const balanceVariation = currentBalance - initialBalance;

        // Convertir satoshis a BTC
        const balanceVariationBTC = balanceVariation / 1e8;

        console.log(`Variación del balance en los últimos ${days} días: ${balanceVariationBTC} BTC`);

    } catch (error) {
        console.error('Error al calcular la variación del balance:', error);
    }
}

calculateBalances("32ixEdVJWo3kmvJGMTZq5jAQVZZeuwnqzo", 3);
calculateBalances("32ixEdVJWo3kmvJGMTZq5jAQVZZeuwnqzo", 1);
calculateBalanceVariation("32ixEdVJWo3kmvJGMTZq5jAQVZZeuwnqzo", 7);
calculateBalanceVariation("32ixEdVJWo3kmvJGMTZq5jAQVZZeuwnqzo", 30);