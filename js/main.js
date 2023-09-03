let sideNavWidth = $(".menu .side-bar").outerWidth();
let data = document.querySelector("#resData");
let searchInputs = document.querySelector("#searchDish");
document.querySelector(".menu").style.left = -sideNavWidth + "px";
$(document).ready(function () {
  getMealByName("").then(function () {
    $(".loading").fadeOut(1000, function () {
      $("body").css("overflow", "visible");
    });
  });
});

$(".open-icon").click(function () {
  if ($(".menu").css("left") == "0px") {
    closeNav();
  } else {
    openNav(); //   $(".links").slideDown(1000);
    // $(".links ul li").animate();
  }
});

function closeNav() {
  $(".menu").animate({ left: -sideNavWidth }, 500);
  $(".open-icon").removeClass("fa-xmark");
  $(".links ul li").animate({ top: "300px" }, 300);
}
function openNav() {
  $(".menu").animate({ left: "0px" }, 500);
  $(".open-icon").addClass("fa-xmark");
  // $("#searchBtn").animate({ top: 0 }, 200, () => {
  //   $("#categoryBtn").animate({ top: 0 }, 200, () => {
  //     $("#areaBtn").animate({ top: 0 }, 200, () => {
  //       $("#ingredientBtn").animate({ top: 0 }, 200, () => {
  //         $("#contactBtn").animate({ top: 0 }, 200);
  //       });
  //     });
  //   });
  // });

  $("#searchBtn").animate({ top: 0 }, 500);
  $("#categoryBtn").animate({ top: 0 }, 600);
  $("#areaBtn").animate({ top: 0 }, 700);
  $("#ingredientBtn").animate({ top: 0 }, 800);
  $("#contactBtn").animate({ top: 0 }, 1000);
}

async function getMealByName(term) {
  $(".row-loading").fadeIn(200);
  data.innerHTML = "";
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  if (req.status == 200) {
    let res = await req.json();
    console.log(res);

    showMeals(res.meals);
    $(".row-loading").fadeOut(200);
  }
}
async function getMealByFirstLetter(term) {
  $(".row-loading").fadeIn(200);
  data.innerHTML = "";
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  if (req.status == 200) {
    let res = await req.json();
    console.log(res);

    showMeals(res.meals);
    $(".row-loading").fadeOut(200);
  }
}

function showMeals(arr) {
  let box = "";
  for (let i = 0; i < arr.length; i++) {
    box += `<div class="col-md-3">
    <div onclick="getMealRecipe('${arr[i].idMeal}')" class="dish position-relative overflow-hidden " >
      <img
        src="${arr[i].strMealThumb}"
        class="w-100 rounded-2"
        alt=""
      />
      <div
        class="layer position-absolute d-flex align-items-center bottom-0 start-0 end-0 rounded-2 p-2"
      >
        <h3>${arr[i].strMeal}</h3>
      </div>
    </div>
  </div>`;
  }
  data.innerHTML = box;
}

async function getMealRecipe(term) {
  $(".row-loading").fadeIn(200);
  data.innerHTML = "";
  searchInputs.innerHTML = "";

  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${term}`
  );
  if (req.status == 200) {
    let res = await req.json();
    showMealRecipe(res.meals[0]);
    $(".row-loading").fadeOut(200);
  }
}

function showMealRecipe(arr) {
  document.querySelector("#searchDish").innerHTML = "";
  let box = "";
  for (let i = 0; i < 20; i++) {
    if (arr["strIngredient" + i]) {
      box += `<li class="bg-info rounded-1 py-1 px-1 bg-opacity-75">
${arr["strMeasure" + i]}${arr["strIngredient" + i]}
</li>`;
    }
  }
  let tagsBox = "";
  if (arr.strTags == null) {
    tagsBox = "";
  } else if (arr.strTags.includes(",") == true) {
    var tags = arr.strTags.split(",");
    console.log(tags);

    for (let i = 0; i < tags.length; i++) {
      tagsBox += `<li class="bg-danger rounded-1 py-1 px-1 bg-opacity-50">${tags[i]}</li>
`;
    }
  } else {
    tagsBox = `<li class="bg-danger rounded-1 py-1 px-1 bg-opacity-50">${arr.strTags}</li>`;
  }
  data.innerHTML = ` <div class="col-md-4">
  <div class="photo d-flex flex-column text-white p-1">
    <img
      src="${arr.strMealThumb}"
      class="w-100 rounded-2"
      alt=""
    />
    <h2>${arr.strMeal}</h2>
  </div>
</div>

<div class="col-md-8">
  <div class="details text-white">
    <h2>Instructions</h2>

   <p>${arr.strInstructions} </p>

    <h3><span class="fw-bold">Area : </span>${arr.strArea}</h3>
    <h3><span class="fw-bold">Category : </span>${arr.strCategory}</h3>
    <h3><span class="fw-bold">Recipes : </span></h3>
    <ul class="list-unstyled d-flex flex-wrap">
      ${box}
    </ul>
    <h3><span class="fw-bold">Tags : </span></h3>
    <ul class="list-unstyled d-flex flex-wrap">
      ${tagsBox}
    </ul>

    <div class="details-btn">
      <a href="${arr.strSource}" class="btn btn-success text-white" target="_blank">Source</a>
      <a href="${arr.strYoutube}" class="btn btn-danger text-white" target="_blank">Youtube</a>
    </div>
  </div>
</div>
</div>`;
}

function showSearchInput() {
  closeNav();
  data.innerHTML = "";
  searchInputs.innerHTML = ` <div class="row">
  <div class="col-md-6">
    <div class="input">
      <input
        type="text"
        class="form-control bg-transparent text-white"
        placeholder="Search By Name"
        onkeyup="getMealByName(this.value)"
      />
    </div>
  </div>
  <div class="col-md-6">
    <div class="input">
      <input
        type="text"
        class="form-control bg-transparent text-white"
        placeholder="Search By First Letter"
        onkeyup="getMealByFirstLetter(this.value)"
      />
    </div>
  </div>
</div>`;
}

async function getCategory() {
  searchInputs.innerHTML = "";
  $(".row-loading").fadeIn(200);
  data.innerHTML = "";
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  if (req.status == 200) {
    let res = await req.json();
    showCategory(res.categories);
    $(".row-loading").fadeOut(200);
  }
}

function showCategory(arr) {
  closeNav();
  let box = "";
  for (let i = 0; i < arr.length; i++) {
    let limit = 50;
    if (arr[i].strCategoryDescription.length > limit) {
      desc = arr[i].strCategoryDescription.split(" ").slice(1, 20).join(" ");
    }
    box += `
    <div class="col-md-3">
            <div class="category-dish position-relative " onclick="getMealByCategory('${arr[i].strCategory}')">
              <img
                src="${arr[i].strCategoryThumb}"
                class="w-100 rounded-2"
                alt=""
              />
              <div
                class="layer position-absolute text-center bottom-0 start-0 end-0 rounded-2 p-2"
              >
                <h3>${arr[i].strCategory}</h3>
                <p>
                ${desc}
                </p>
              </div>
            </div>
          </div>`;
  }

  data.innerHTML = box;
}

async function getMealByCategory(term) {
  $(".row-loading").fadeIn(200);

  data.innerHTML = "";
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${term}`
  );
  if (req.status == 200) {
    let res = await req.json();
    showMeals(res.meals.slice(0, 20));
    $(".row-loading").fadeOut(200);
  }
}

async function getIngredient() {
  searchInputs.innerHTML = "";

  $(".row-loading").fadeIn(200);
  data.innerHTML = "";
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  if (req.status == 200) {
    let res = await req.json();
    showIngredients(res.meals.slice(0, 20));
    $(".row-loading").fadeOut(200);
  }
}

function showIngredients(arr) {
  closeNav();
  let box = "";
  for (let i = 0; i < arr.length; i++) {
    let limit = 50;
    if (arr[i].strDescription.length > limit) {
      desc = arr[i].strDescription.split(" ").slice(1, 20).join(" ");
    }
    box += `<div class="col-md-3">
    <div
      class="ingredient d-flex flex-column justify-content-center align-items-center text-white text-center" onclick="getMealByIngredient('${arr[i].strIngredient}')"
    >
      <i class="fa-solid fa-drumstick-bite fa-4x"></i>
      <h3>${arr[i].strIngredient}</h3>
      <p>
      ${desc}
      </p>
    </div>
  </div>`;
  }
  data.innerHTML = box;
}

async function getMealByIngredient(term) {
  $(".row-loading").fadeIn(200);

  data.innerHTML = "";
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${term}`
  );
  if (req.status == 200) {
    let res = await req.json();
    showMeals(res.meals);
    $(".row-loading").fadeOut(200);
  }
}

async function getArea() {
  searchInputs.innerHTML = "";

  $(".row-loading").fadeIn(200);
  data.innerHTML = "";
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  if (req.status == 200) {
    let res = await req.json();
    showArea(res.meals);
    $(".row-loading").fadeOut(200);
  }
}

function showArea(arr) {
  closeNav();
  let box = "";
  for (let i = 0; i < arr.length; i++) {
    box += `<div class="col-md-3">
    <div class="box d-flex flex-column text-center text-white" onclick="getMealByArea('${arr[i].strArea}')" >
      <i class="fa-solid fa-house-laptop fa-4x"></i>
      <h3>${arr[i].strArea}</h3>
    </div>
  </div>`;
  }
  data.innerHTML = box;
}

async function getMealByArea(term) {
  $(".row-loading").fadeIn(200);
  data.innerHTML = "";
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${term}`
  );
  if (req.status == 200) {
    let res = await req.json();
    showMeals(res.meals.slice(0, 20));
    $(".row-loading").fadeOut(200);
  }
}

function showContact() {
  searchInputs.innerHTML = "";
  closeNav();

  data.innerHTML = ` <div
  class="container  vh-100 d-flex justify-content-center align-items-center"
>
  <div class="w-75 m-auto">
    <div class="row g-4">
      <div class="col-md-6">
        <div class="input d-flex flex-column">
          <input
            type="text"
            class="form-control"
            placeholder="Enter your name"
            id="name"
            onkeyup="validateBtn()"
          />
          <div
            class="alert alert-danger name-alert d-none text-center rounded-2 text-danger mt-2"
          >
            Special characters and numbers not allowed
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input">
          <input
            type="email"
            class="form-control"
            placeholder="Enter your email"
            id="email"
            onkeyup="validateBtn()"
          />
          <div
            class="alert alert-danger email-alert d-none text-center rounded-2 text-danger mt-2"
          >
            Special characters and numbers not allowed
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input">
          <input
            type="number"
            class="form-control"
            placeholder="Enter your phone"
            id="phone"
            onkeyup="validateBtn()"
          />
          
          <div
            class="alert alert-danger phone-alert d-none text-center rounded-2 text-danger mt-2"
          >
            Enter a valid phone number
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input">
          <input
            type="number"
            class="form-control"
            placeholder="Enter your age"
            id="age" 
            onkeyup="validateBtn()"           />
          <div
            class="alert alert-danger age-alert d-none text-center rounded-2 text-danger mt-2 py-2"
          >
            Enter valid age
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input">
          <input
            type="password"
            class="form-control"
            placeholder="Enter your password"
            id="password"
            onkeyup="validateBtn()"
          />
          <div
            class="alert alert-danger pass-alert d-none text-center rounded-2 text-danger mt-2"
          >
            Enter valid password *Minimum eight characters, at least one
            letter and one number:*
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input">
          <input
            type="password"
            class="form-control"
            placeholder="Re-password"
            id="re-pass" 
            onkeyup="validateBtn()"
            />
          <div
            class="alert alert-danger repass-alert d-none text-center rounded-2 text-danger mt-2"
          >
            Enter valid Re-password
          </div>
        </div>
      </div>
      <div class="col-md-12 text-center">
        <button
          type="button"
          class="btn btn-outline-danger"
          disabled="true"
          id="submitContact"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</div>`;
  document.querySelector("#name").addEventListener("change", () => {
    nameValidation();
  });

  document.querySelector("#email").addEventListener("change", () => {
    emailValidation();
  });
  document.querySelector("#phone").addEventListener("change", () => {
    phoneValidation();
  });
  document.querySelector("#age").addEventListener("change", () => {
    ageValidation();
  });
  document.querySelector("#password").addEventListener("change", () => {
    passValidation();
  });
  document.querySelector("#re-pass").addEventListener("change", () => {
    rePassValidation();
  });
}

function nameValidation() {
  let name = document.querySelector("#name");
  nameRegex = /^[a-zA-Z ]+$/;
  if (nameRegex.test(name.value) == false) {
    document.querySelector(".name-alert").classList.replace("d-none", "d-flex");
    console.log("i worked --");
  } else {
    document.querySelector(".name-alert").classList.replace("d-flex", "d-none");
    return true;
  }
}
function emailValidation() {
  let email = document.querySelector("#email");
  emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailRegex.test(email.value) == false) {
    document
      .querySelector(".email-alert")
      .classList.replace("d-none", "d-flex");
  } else {
    document
      .querySelector(".email-alert")
      .classList.replace("d-flex", "d-none");
    return true;
  }
}

function phoneValidation() {
  let phone = document.querySelector("#phone");
  phoneRegex = /^01[0125][0-9]{8}$/;
  if (phoneRegex.test(phone.value) == false) {
    document
      .querySelector(".phone-alert")
      .classList.replace("d-none", "d-flex");
  } else {
    document
      .querySelector(".phone-alert")
      .classList.replace("d-flex", "d-none");
    return true;
  }
}

function ageValidation() {
  let age = document.querySelector("#age");
  ageRegex = /^(1[89]|[2-9]\d)$/;
  if (ageRegex.test(age.value) == false) {
    document.querySelector(".age-alert").classList.replace("d-none", "d-flex");
  } else {
    document.querySelector(".age-alert").classList.replace("d-flex", "d-none");
    return true;
  }
}

function passValidation() {
  let pass = document.querySelector("#password");
  passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (passRegex.test(pass.value) == false) {
    document.querySelector(".pass-alert").classList.replace("d-none", "d-flex");
  } else {
    document.querySelector(".pass-alert").classList.replace("d-flex", "d-none");
    return true;
  }
}
function rePassValidation() {
  if (
    document.querySelector("#re-pass").value ==
    document.querySelector("#password").value
  ) {
    document
      .querySelector(".repass-alert")
      .classList.replace("d-flex", "d-none");
    return true;
  } else {
    document
      .querySelector(".repass-alert")
      .classList.replace("d-none", "d-flex");
  }
}

function validateBtn() {
  let submitBtn = document.querySelector("#submitContact");
  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passValidation() &&
    rePassValidation() == true
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", "true");
  }
}
