function parseQueryString(queryString: string) {
  const params = queryString.split('&').map(param => {
    const [key, value] = param.split('=');
    return { name: key, value };
  });
  return params;
}

export default parseQueryString;