fetch("http://localhost:3000/api/welcome")
  .then(res => res.json())
  .then(data => {
      console.log(data);
      document.getElementById("msg").innerText = data.message;
  });
