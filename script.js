class Short {
  #date;
  list;
  usageToday;

  constructor(input, submitF) {
    this.input = document.querySelector("input[type=text]");
    this.submit = document.querySelector("input[type=submit");
    this.form = document.querySelector("form");
    this.spinner = document.querySelector(".spinner");
    this.refresh = document.querySelector(".refresh");
    this.resultsDisplay = document.querySelector(".result");
    this.history = document.querySelector(".historyIcon");
    this.icon = document.querySelector(".close");
  }
  getHistory() {
    this.list = JSON.parse(localStorage.getItem("URLs"));
    console.log(this.list, this.refresh);
    //   console.log(list.length);
    if (this.list.length !== 0) {
      console.log(this);
      this.refresh.style.display = "none";
      this.icon.style.opacity = "1";
      this.form.style.display = "none";
      this.resultsDisplay.replaceChildren();
      this.resultsDisplay.style.display = "block";
      this.resultsDisplay.style.backgroundColor = "#eee";
      // console.log(list);
      this.list.forEach((ele) => this.resultELement(ele));
      // resultsDisplay.style.setProperty("--code", "\f00d");
      this.deletebtn();
    } else {
      this.refresh.style.display = "none";
      this.resultsDisplay.replaceChildren();
      this.resultsDisplay.style.display = "none";
      this.form.style.display = "flex";
      this.submit.style.display = "block";
    }
  }
  shortener(url) {
    console.log(this);
    this.#date = new Date();
    console.log(this.#date.getHours());
    this.usageToday = JSON.parse(window.localStorage.getItem("usageToday"));
    console.log(typeof this.usageToday[2]);
    if (this.usageToday) {
      if (
        this.usageToday.length === 3 &&
        this.#date.getHours() - new Date(this.usageToday[2]).getHours() < 23
      ) {
        this.resultsDisplay.style.display = "flex";
        this.resultsDisplay.textContent = "You Exceeded Daily Limit Of 3";

        throw Error("You Exceeded Daily Limit Of 3");
      } else if (
        this.usageToday.length === 3 &&
        this.#date.getHours() - new Date(this.usageToday[2]).getHours() === 23
      ) {
        this.usageToday = [];
        this.usageToday.push(this.#date);
        window.localStorage.setItem(
          "usageToday",
          JSON.stringify(this.usageToday)
        );
      }
      this.usageToday.push(this.#date);
      window.localStorage.setItem(
        "usageToday",
        JSON.stringify(this.usageToday)
      );
    } else {
      this.usageToday = [];
      this.usageToday.push(this.#date);
      window.localStorage.setItem(
        "usageToday",
        JSON.stringify(this.usageToday)
      );
    }

    this.spinner.style.display = "block";
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
        this.spinner.style.display = "none";
        console.log(result);
        if (result.message === "Not a valid url") {
          throw Error(result.message);
        }
        this.resultELement(result);
        this.list = JSON.parse(localStorage.getItem("URLs"));
        this.list.push(result);
        window.localStorage.setItem("URLs", JSON.stringify(this.list));

        return result;
      })
      .then((res) => {
        document.querySelector(".delete").addEventListener(
          "click",
          function (e) {
            e.target.parentElement.remove();
            console.log(this);

            this.resultsDisplay.style.display = "none";
            this.list = JSON.parse(localStorage.getItem("URLs"));
            this.list.pop();
            window.localStorage.setItem("URLs", JSON.stringify(this.list));
          }.bind(this)
        );
        return res;
      })

      .catch((error) => {
        console.log("error", error);
        this.resultsDisplay.style.display = "flex";

        this.resultsDisplay.insertAdjacentText("afterbegin", `${error} 🔨`);
      });
  }
  submitF() {
    console.log(this);
    this.list = JSON.parse(window.localStorage.getItem("URLs"));
    this.list.forEach((ele) => {
      if (ele.long_url === this.input.value) {
        this.resultsDisplay.style.display = "flex";
        this.resultsDisplay.textContent = "Link already shortened";
        this.input.value = "";
        this.refresh.style.display = "inline-block";
        this.submit.style.display = "none";
      }
    });
    if (!this.input.value) throw Error("Empty Input");

    this.shortener(this.input.value);
    this.input.value = "";
    this.submit.style.display = "none";
    this.refresh.style.display = "inline-block";
  }

  refreshF() {
    this.submit.style.display = "block";
    this.refresh.style.display = "none";
    this.resultsDisplay.style.display = "none";
    this.resultsDisplay.removeChild(this.resultsDisplay.firstChild);
  }
  resultELement(response) {
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
    this.resultsDisplay.insertAdjacentHTML("afterbegin", html);
    this.resultsDisplay.style.display = "block";
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
  }

  deletebtn() {
    this.list = JSON.parse(localStorage.getItem("URLs"));
    console.log(this.list);
    document.querySelectorAll(".delete").forEach((ele, i) => {
      ele.addEventListener(
        "click",
        function (e) {
          e.target.parentElement.remove();

          if (this.list.length > 1) {
            this.list.splice(i, 1);
          } else if (this.list.length === 1) {
            this.list = [];
          }
          window.localStorage.setItem("URLs", JSON.stringify(this.list));

          if (this.list.length === 0) {
            this.icon.style.opacity = "0";
            this.form.style.display = "flex";
            this.resultsDisplay.replaceChildren();
            this.resultsDisplay.style.display = "none";
          }

          // console.log(list);
        }.bind(this)
      );
    });
  }
  openIcon() {
    this.resultsDisplay.style.marginTop = "0";
    this.icon.style.opacity = "0";
    this.form.style.display = "flex";
    this.submit.style.display = "block";
    this.resultsDisplay.innerHTML = "";
    this.resultsDisplay.style.display = "none";
  }
}
if (!window.localStorage.getItem("URLs")) {
  window.localStorage.setItem("URLs", JSON.stringify([]));
  window.localStorage.setItem("usageToday", JSON.stringify([]));
}
// window.addEventListener("load", function () {
const shortUrl = new Short();
console.log(shortUrl);
shortUrl.history.addEventListener("click", shortUrl.getHistory.bind(shortUrl));
shortUrl.form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(this);
  shortUrl.submitF();
});
shortUrl.refresh.addEventListener("click", shortUrl.refreshF.bind(shortUrl));
shortUrl.icon.addEventListener("click", shortUrl.openIcon.bind(shortUrl));
// });
