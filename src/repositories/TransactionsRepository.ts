import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeValues = [0];
    const outcomeValues = [0];

    this.transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        incomeValues.push(transaction.value);
      } else {
        outcomeValues.push(transaction.value);
      }
    });

    const incomeTotal = incomeValues.reduce(
      (acc: number, value: number) => acc + value,
    );
    const outcomeTotal = outcomeValues.reduce(
      (acc: number, value: number) => acc + value,
    );

    const balance = {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: incomeTotal - outcomeTotal,
    };

    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const balance = this.getBalance();

    if (type === 'outcome') {
      if (balance.total - value < 0) {
        throw Error('You cannot do this operation');
      }
    }

    const transaction = new Transaction({
      title,
      value,
      type,
    });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
