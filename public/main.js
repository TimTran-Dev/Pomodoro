var trash = document.getElementsByClassName("delete");
let day = document.getElementsByClassName("theDay").value;
let hour = document.getElementsByClassName("theHour").value;
let minute = document.getElementsByClassName("theMinute").value;
let second = document.getElementsByClassName("theSecond").value;
let click = document.getElementsByClassName("fa-play-circle");
let edit = document.getElementsByClassName("fa-edit");
let initialTime = new Date().getTime();

var deadline = null;
let startTimer = function() {
  return setInterval(function() {
    if (deadline) {
      var now = new Date().getTime();

      var t = deadline - now;
      console.log("deadline", deadline, "now", now, "t", t);
      var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((t % (1000 * 60)) / 1000);
      document.getElementById("hour").innerHTML = hours;
      document.getElementById("minute").innerHTML = minutes;
      document.getElementById("second").innerHTML = seconds;
      if (t < 0) {
        clearInterval(startTimer);
        document.getElementById("demo").innerHTML = "TIME UP";
        document.getElementById("hour").innerHTML = "0";
        document.getElementById("minute").innerHTML = "0";
        document.getElementById("second").innerHTML = "0";
      }
    }
  }, 1000);
};
startTimer();

Array.from(trash).forEach(function(element) {
  element.addEventListener("click", function() {
    console.log(trash);
    const hour = this.parentNode.childNodes[1].innerText;
    const minute = this.parentNode.childNodes[3].innerText;
    const second = this.parentNode.childNodes[5].innerText;
    fetch("profile", {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hour: hour,
        minute: minute,
        second: second
      })
    }).then(function(response) {
      console.log(response);
      window.location.reload();
    });
  });
});

// pencil to edit/update without creating new object
Array.from(edit).forEach(function(element) {
  element.addEventListener("click", function() {
    console.log(edit);
    const hour = this.parentNode.parentNode.childNodes[1].innerText;
    const minute = this.parentNode.parentNode.childNodes[3].innerText;
    const second = this.parentNode.parentNode.childNodes[5].innerText;
    const _id = this.parentNode.parentNode.childNodes[7].innerText;
    console.log(hour, minute, second);
    fetch("profile", {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hour: hour,
        minute: minute,
        second: second,
        _id: _id
      })
    }).then(function(response) {
      console.log(response);
      window.location.reload();
    });
  });
});

Array.from(click).forEach(function(element) {
  element.addEventListener("click", function(event) {
    let userSelectedTime = event.target.parentNode.parentNode.innerText
      .split(" ")
      .filter(Boolean);
    let today = new Date();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let year = today.getFullYear();
    deadline = new Date(
      `${month} ${day}, ${year} ${userSelectedTime[0]}:${userSelectedTime[1]}:${
        userSelectedTime[2]
      }`
    ).getTime();
  });
});
