//= require ./all_nosearch
//= require ./app/_search

// var prevScrollpos = window.pageYOffset;
// window.onscroll = function() {
// var currentScrollPos = window.pageYOffset;
//
//
//   var header = document.getElementById("header");
//   var tocWrapper = document.getElementById("autoOpenClose");
//   var langs = document.getElementById("langs");
//   var search = document.getElementById("search");
//   var navbtn = document.getElementById("nav-button");
//
//   // header.style.top = "0";
//   // tocWrapper.style.top = "45px";
//   // langs.style.top = "45px";
//   // navbtn.style.top = "0";
//   // search.style.top = "1px";
//   if (prevScrollpos > currentScrollPos) {
//     header.style.top = "0";
//     tocWrapper.style.top = "45px";
//     langs.style.top = "45px";
//     navbtn.style.top = "45px";
//     search.style.top = "1px";
//   } else {
//     header.style.top = "-45px";
//     tocWrapper.style.top = "0";
//     langs.style.top = "0";
//     navbtn.style.top = "0";
//     search.style.top = "-45px";
//   }
//   prevScrollpos = currentScrollPos;
// }

function dropdown() {
    document.getElementById("subDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.menu_links')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
