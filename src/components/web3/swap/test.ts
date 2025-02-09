const mergeCoins = (formatedCoins: any) => {
    return formatedCoins.reduce((acc: any, coin: any) => {
    if (coin) {
      const existingCoin = acc.find(
        (c: any) => c.coinType === coin?.coinType
      );
      if (existingCoin) {
        // @ts-ignore
        existingCoin.balance += coin?.balance;
      } else {
        // @ts-ignore
        acc.push(coin);
      }
    }
    return acc;
}, []);