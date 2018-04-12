if (process.argv.length < 4) {
    console.log('please pass parameters');
    return;
} 

const { exec } = require('child_process');
const { spawn } = require('child_process');
const db_connection = require("./db");
db_connection.connect();

const number_of_clients = process.argv[2];
const cycle_count = process.argv[3];
const ss_time = new Date().getTime();


/* 
    nezavisni upiti ka bazi se izvrsavaju sinhronizovano, u jednakim vremenskim intervalima
    scenario koji nuzno vodi ka gresci:
        2 nezavisne konekcije
        1 tabela
        konekcija _A uvek int vrednost+=1
        konekcija _B uvek  int vrednost-=1
*/

let responses = 0;

console.log(`\n\tMaking ${number_of_clients} parallel connections.`);
console.log(`\tAttempting ${cycle_count} updates on ech connection.`);

for (let index = 1; index <= number_of_clients; index++) {
    const command = spawn('node', ['client.js', index, cycle_count]);

    command.stdout.on('data', (data) => {
        console.log(`cl_${index}: ${data}`);
    });

    // command.stderr.on('data', (data) => {
    //     console.log(`stderr: ${data}`);
    // });

    command.on('close', (code) => {
        // console.log(`child process ${index} exited with code ${code}`);
        responses += 1;
        if (responses == number_of_clients) {
            
            const es_time = new Date().getTime();
            const sript_exec_time = (es_time - ss_time) / 1000;
            console.log(`\tFinished in ${sript_exec_time} seconds time`);
            console.log(`\n\t...fetching newest balance...`);
            db_connection.query('select balance as newest_balance from users where id = 1', function (error, results, fields) {
                if (error) {
                    throw error;
                }
                setTimeout(function () {
                    console.log(`\tNewest balance is: ${results[0].newest_balance}`);
                    console.log("\n");
                    db_connection.end();
                }, 1000);
            });


        }
    });
}

// https://dev.mysql.com/doc/refman/5.7/en/commit.html
// https://dev.mysql.com/doc/refman/5.7/en/create-procedure.html
// https://dev.mysql.com/doc/refman/5.7/en/glossary.html#glos_transaction
// https://dev.mysql.com/doc/refman/5.7/en/flow-control-statements.html

// https://alvinalexander.com/blog/post/mysql/how-show-open-database-connections-mysql
// https://stackoverflow.com/questions/7432241/mysql-show-status-active-or-total-connections