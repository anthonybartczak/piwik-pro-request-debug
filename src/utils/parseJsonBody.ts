function parseQueryParamsFromJson(
  requests: { query_params: { [key: string]: string } }[],
): { name: string; value: string }[] {
  return requests.flatMap((request) =>
    Object.entries(request.query_params).map(([name, value]) => ({
      name,
      value,
    })),
  );
}

export default parseQueryParamsFromJson;
