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
                callback({'success': 'false', 'msg': err});
                return;
            }

            var idx = 0;

            while (idx < result.rows.length) {
                transaction = {
                    'id': result.rows[idx].trans_id,
                    'tradePartner1': result.rows[idx].ibl_team,
                    'tradePartner2': result.rows[idx + 1].ibl_team,
                    'description': result.rows[idx].ibl_team + ' ' + result.rows[idx].log_entry,
                    'date': result.rows[idx].transaction_date 
                };
                transactions.push(transaction);
                idx = idx  + 2;
            }
            callback(transactions);
        });
    };
}

module.exports.TransactionModel = TransactionModel;
