const BE_URL = "http://localhost:8081"

async function fetchModel(url) {
  try{
    const response = await fetch(BE_URL + "/api" + url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    if (!response.ok){
      throw new Error("Network not ok")
    }
    
    return response.json()

  } catch(err){
    console.error("Error with fetch", err)
    throw err
  }
}

export default fetchModel