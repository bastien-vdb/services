const fetcher = async (url: string, method: "GET" | "POST" | "DELETE" = "GET", data: any = null) => {
  try {
    const resultjson = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    });
    if (!resultjson.ok) throw new Error('not possible to fetch')
    return await resultjson.json();
  } catch (error) {
    console.error(error);
    throw new Error("fetcher error");
  }
};

export default fetcher;
