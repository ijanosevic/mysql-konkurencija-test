const db_connection = require("./db");
db_connection.connect();
// console.log(`start.`);

const client_id = process.argv[2];
const limit = parseInt(process.argv[3]);

let sql = '';
if (parseInt(client_id) % 2 == 0) {
    // sql = 'call upVal(1, 1)';
    sql = 'call upValTransaction(1, 1)';
    // sql = 'call upValTransactionConsistent(1, 1)';
} else {
    // sql = 'call downVal(1, 1)';
    sql = 'call downValTransaction(1, 1)';
    // sql = 'call downValTransactionConsistent(1, 1)';
}

let counter = 0;
const interval = setInterval(function () {
    
    if (counter == limit) {
        
        clearInterval(interval);
        // console.log(`end: ${client_id}`);
        db_connection.end();
        return;

    } else if (counter < limit){

        db_connection.query(sql, function (error, results, fields) {
            if (error) {
                throw error;
            }
        });
        counter += 1;
    }
}, 1);