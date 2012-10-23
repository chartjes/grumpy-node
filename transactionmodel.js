function TransactionModel(pgClient) {
    this.client = pgClient;
    this.client.connect();

    this.getArchived = function(callback) {
        var startDate = "(SELECT MAX(transaction_date) FROM transaction_log)-'6 months + 3 weeks'::interval";
        var endDate = "(SELECT MAX(transaction_date) FROM transaction_log)-'6 months'::interval";
        this.createTransactions(startDate, endDate, callback);
    };

    this.getCurrent = function(callback) {
        var startDate = "(SELECT MAX(transaction_date) FROM transaction_log)-'3 weeks'::interval";
        var endDate = "(SELECT MAX(transaction_date) FROM transaction_log)";
        this.createTransactions(startDate, endDate, callback);
    };

    this.createTransactions = function(startDate, endDate, callback) {
        var q = "SELECT * " +
            "FROM transaction_log " +
            "WHERE log_entry LIKE 'Trades%' " +
            "AND transaction_date >= " + startDate +
            " AND transaction_date <= " + endDate +
            " ORDER BY trans_id DESC ";
        var transactions = [];

        this.client.query(q, function (err, result) {
            if (err) {
                console.log(err);
                //callback convention is error first
                callback(err, {'success': 'false', 'msg': err});
                return;
            }

            var idx = 0;

            //run this function for every row, return results for even rows
            var transactions = result.rows.map(function(row, idx, rows) {
                if(idx % 2 == 0) {
                    //only map even trasactions back
                    return {
                        'id': row.trans_id,
                        'tradePartner1': row.ibl_team,
                        'tradePartner2': rows[idx + 1].ibl_team,
                        'description': row.ibl_team + ' ' + row.log_entry,
                        'date': row.transaction_date 
                    };
                }
            });

            //now we have a transaction for every even row of results, with every odd being undefined
            //lets omit the undefined rows
            transactions = transactions.reduce(function(prev, cur, idx, transactions) {
                if(idx % 2 == 0) {
                    //if this is an even row, append the row to the reduced transactions
                    return prev.concat([cur]);
                } 
                return prev; 
            }, []);

            //error first
            callback(false, transactions);
        });
    };
}

module.exports.TransactionModel = TransactionModel;
