export const fetchMainAddress = (
  domain: string,
  address: string
): Promise<any> => {
  return fetch(`${domain}/${address}`).then((response) => response.json());
};
