const input = document.querySelector("input[type=text]");
const submit = document.querySelector("input[type=submit");
const form = document.querySelector("form");
const spinner = document.querySelector(".spinner");
const refresh = document.querySelector(".refresh");
const resultsDisplay = document.querySelector(".result");
const history = document.querySelector(".historyIcon");
const icon = document.querySelector(".close");
const resultELement = function (response) {
  const html = `<ul>
    <li class="long">  <button class="copyL">
    <img
      src="images/paper.png"
      alt=""
    />
  </button >
      <a
        href="${response.long_url}"
        target="_blank"
      >${response.long_url}</a>
    
    </li>
    <li class="short">   <button class="copyS">
    <img
      src="images/paper.png"
      alt=""
    />
  </button>
      <a
        href="${response.short_url}"
        target="_blank"
      >${response.short_url}</a>
   
    </li>    
<button class="delete">Delete</button><hr>
    </ul>
    `;
  resultsDisplay.insertAdjacentHTML("afterbegin", html);
  resultsDisplay.style.display = "block";
  const copyLong = document.querySelector(".long button");
  const copyShort = document.querySelector(".short button");
  const button = document.querySelectorAll("li button");

  button.forEach((ele) => {
    ele.addEventListener("click", function (e) {
      if (e.target.parentElement === copyLong) {
        navigator.clipboard
          .writeText(response.long_url)
          .then((res) => console.log("success"));
      } else if (e.target.parentElement === copyShort) {
        navigator.clipboard
          .writeText(response.short_url)
          .then((res) => console.log("success"));
      }
    });
  });
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!input.value) return;

  shortener(input.value);
  input.value = "";
  submit.style.display = "none";
  refresh.style.display = "inline-block";
});
refresh.addEventListener("click", function (e) {
  resultsDisplay.innerHTML = "";
  submit.style.display = "block";
  refresh.style.display = "none";
  resultsDisplay.style.display = "none";
  resultsDisplay.removeChild(resultsDisplay.firstChild);
});
const storageArr = [];
const shortener = function (url) {
  spinner.style.display = "block";
  const myHeaders = new Headers();
  myHeaders.append("apikey", "b7hJ1v2fsbasMNn1Hbco0ch3kHI4uWAF");
  const raw = `${url}`;
  const requestOptions = {
    method: "POST",
    redirect: "follow",
    headers: myHeaders,
    body: raw,
  };

  fetch("https://api.apilayer.com/short_url/hash", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const data = JSON.parse(result);
      return data;
    })
    .then((result) => {
      spinner.style.display = "none";
      console.log(result);
      if (result.message === "Not a valid url") {
        throw Error(result.message);
      }
      resultELement(result);
      storageArr.push(result);

      window.localStorage.setItem("URLs", JSON.stringify(storageArr));

      return result;
    })
    .then((res) => {
      document.querySelector(".delete").addEventListener("click", function (e) {
        e.target.parentElement.remove();
        resultsDisplay.style.display = "none";

        let list = JSON.parse(localStorage.getItem("URLs"));
        list.pop();
        window.localStorage.setItem("URLs", JSON.stringify(list));
      });
      return res;
    })

    .catch((error) => {
      console.log("error", error);
      resultsDisplay.style.display = "flex";

      resultsDisplay.insertAdjacentText("afterbegin", `${error} 🔨`);
    });
  console.log(myHeaders);
};

history.addEventListener("click", function () {
  input.style.display = "block";
  submit.style.display = "block";
});

history.addEventListener("click", function () {
  let list = JSON.parse(localStorage.getItem("URLs"));
  console.log(list);
  //   console.log(list.length);
  if (list.length !== 0) {
    refresh.style.display = "none";
    icon.style.opacity = "1";
    form.style.display = "none";
    resultsDisplay.replaceChildren();
    resultsDisplay.style.display = "block";
    const x = window.matchMedia("(max-width: 900px)");
    if (x.matches) {
      resultsDisplay.style.marginTop = "-200px";
    }
    resultsDisplay.style.backgroundColor = "#eee";
    // console.log(list);
    list.forEach((ele) => resultELement(ele));
    // resultsDisplay.style.setProperty("--code", "\f00d");
    document.querySelectorAll(".delete").forEach((ele, i) => {
      ele.addEventListener("click", function (e) {
        e.target.parentElement.remove();
        list.splice(i, 1);
        if (list.length === 0) {
          icon.style.opacity = "0";
          form.style.display = "flex";
          const x = window.matchMedia("(max-width: 900px)");
          if (x.matches) {
            resultsDisplay.style.marginTop = "-200px";
          }
        }
        // console.log(list);
        window.localStorage.setItem("URLs", JSON.stringify(list));
      });
    });
  } else {
    refresh.style.display = "none";
    resultsDisplay.replaceChildren();
    resultsDisplay.style.display = "none";
  }
});
icon.addEventListener("click", function (e) {
  resultsDisplay.style.marginTop = "0";
  icon.style.opacity = "0";
  form.style.display = "flex";
  resultsDisplay.innerHTML = "";
  resultsDisplay.style.display = "none";
});
