export const fetchCardanoAddress = (address: string) => {
  fetch(`https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}`, {
    headers: {
      project_id: "xCDic1xoxPW4T2ehiZzW0vPO4QB78SCm",
    },
  })
    .then((response) => response.json())
    .then((res) => {
      let amount = 0;
      for (let a of res.amount) {
        amount += +a.quantity;
      }
      const sumAmount = amount / 1000000;
      console.log(sumAmount);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

// fetchCardanoAddress(
//   "addr1qxggcmv7zw25vwsszqvvezfgntgl74z07gdh27y6j63xrsp92kus8k25ckf2lxfw9sau794307d9n5ucpnd5lhmdqzwqj9d277"
// );
