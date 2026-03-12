const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
  try {

    const res = await fetch("http://localhost:5000/pharmacy/medicine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pharmacy_id: 1,
        medicine_id: 1,
        stock: 50,
        price: 20
      })
    });

    const data = await res.json();
    console.log(data);

  } catch (err) {
    console.error(err);
  }
}

testAPI();