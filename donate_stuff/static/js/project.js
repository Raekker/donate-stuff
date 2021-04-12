document.addEventListener("DOMContentLoaded", function() {
  /**
   * HomePage - Help section
   */
  class Help {
    constructor($el) {
      this.$el = $el;
      this.$buttonsContainer = $el.querySelector(".help--buttons");
      this.$slidesContainers = $el.querySelectorAll(".help--slides");
      this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
      this.init();
    }

    init() {
      this.events();
    }

    events() {
      /**
       * Slide buttons
       */
      this.$buttonsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("btn")) {
          this.changeSlide(e);
        }
      });

      /**
       * Pagination buttons
       */
      this.$el.addEventListener("click", e => {
        if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
          this.changePage(e);
        }
      });
    }

    changeSlide(e) {
      e.preventDefault();
      const $btn = e.target;

      // Buttons Active class change
      [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
      $btn.classList.add("active");

      // Current slide
      this.currentSlide = $btn.parentElement.dataset.id;

      // Slides active class change
      this.$slidesContainers.forEach(el => {
        el.classList.remove("active");

        if (el.dataset.id === this.currentSlide) {
          el.classList.add("active");
        }
      });
    }

    /**
     * TODO: callback to page change event
     */
    changePage(e) {
      e.preventDefault();
      const page = e.target.dataset.page;

      console.log(page);
    }
  }
  const helpSection = document.querySelector(".help");
  if (helpSection !== null) {
    new Help(helpSection);
  }

  /**
   * Form Select
   */
  class FormSelect {
    constructor($el) {
      this.$el = $el;
      this.options = [...$el.children];
      this.init();
    }

    init() {
      this.createElements();
      this.addEvents();
      this.$el.parentElement.removeChild(this.$el);
    }

    createElements() {
      // Input for value
      this.valueInput = document.createElement("input");
      this.valueInput.type = "text";
      this.valueInput.name = this.$el.name;

      // Dropdown container
      this.dropdown = document.createElement("div");
      this.dropdown.classList.add("dropdown");

      // List container
      this.ul = document.createElement("ul");

      // All list options
      this.options.forEach((el, i) => {
        const li = document.createElement("li");
        li.dataset.value = el.value;
        li.innerText = el.innerText;

        if (i === 0) {
          // First clickable option
          this.current = document.createElement("div");
          this.current.innerText = el.innerText;
          this.dropdown.appendChild(this.current);
          this.valueInput.value = el.value;
          li.classList.add("selected");
        }

        this.ul.appendChild(li);
      });

      this.dropdown.appendChild(this.ul);
      this.dropdown.appendChild(this.valueInput);
      this.$el.parentElement.appendChild(this.dropdown);
    }

    addEvents() {
      this.dropdown.addEventListener("click", e => {
        const target = e.target;
        this.dropdown.classList.toggle("selecting");

        // Save new value only when clicked on li
        if (target.tagName === "LI") {
          this.valueInput.value = target.dataset.value;
          this.current.innerText = target.innerText;
        }
      });
    }
  }
  document.querySelectorAll(".form-group--dropdown select").forEach(el => {
    new FormSelect(el);
  });

  /**
   * Hide elements when clicked on document
   */
  document.addEventListener("click", function(e) {
    const target = e.target;
    const tagName = target.tagName;

    if (target.classList.contains("dropdown")) return false;

    if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
      return false;
    }

    if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
      return false;
    }

    document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
      el.classList.remove("selecting");
    });
  });

  /**
   * Switching between form steps
   */
  class FormSteps {
    constructor(form) {
      this.$form = form;
      this.$next = form.querySelectorAll(".next-step");
      this.$prev = form.querySelectorAll(".prev-step");
      this.$step = form.querySelector(".form--steps-counter span");
      this.currentStep = 1;

      this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
      const $stepForms = form.querySelectorAll("form > div");
      this.slides = [...this.$stepInstructions, ...$stepForms];

      this.init();
    }

    /**
     * Init all methods
     */
    init() {
      this.events();
      this.updateForm();
    }

    /**
     * All events that are happening in form
     */
    events() {
      // Next step
      this.$next.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          if(this.currentStep === 1) {
            const institutions = getInstitutions(getSelectedCategories());
            displayInstitutions(institutions);
          } else if (this.currentStep === 4) {
            displaySummary(getInputs());
          }
          this.currentStep++;
          this.updateForm();
        });
      });

      // Previous step
      this.$prev.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
      });

      // Form submit
      this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
    }

    /**
     * Update form front-end
     * Show next or previous section etc.
     */
    updateForm() {
      this.$step.innerText = this.currentStep;

      // TODO: Validation

      this.slides.forEach(slide => {
        slide.classList.remove("active");

        if (slide.dataset.step == this.currentStep) {
          slide.classList.add("active");
        }
      });

      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
      this.$step.parentElement.hidden = this.currentStep >= 6;

      // TODO: get data from inputs and show them in summary
    }

    /**
     * Submit form
     *
     * TODO: validation, send data to server
     */
    submit(e) {
      e.preventDefault();
      let result = sendDonationData(getInputs());
      result.then(response => {
        if (response.ok) {
          window.location.replace("confirmation/");
        }
      })
      this.currentStep++;
      this.updateForm();
    }
  }
  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
    displayCategories(getCategories());
  }
});

function getInstitutions(categories) {
  let filter = ""
  let prepFilter = []
  for (const category in categories) {
    prepFilter.push(`categories=${category}`);
  }
  filter = prepFilter.join("&");
  return fetch(
      "/api/institutions/?" + filter
  ).then(
      resp => {
        if(!resp.ok) {
          alert("Error Occurred")
        }
        return resp.json();
      }
  );
}

function getCategories() {
  return fetch(
      "/api/categories/"
  ).then(
      resp => {
        if(!resp.ok) {
          alert("Error Occurred")
        }
        return resp.json();
      }
  );
}

function displayCategories(categories) {
  categories.then(resp => {
    const categoriesDiv = document.querySelector("div[data-step='1'] div.checkbox-container");
    categoriesDiv.innerHTML = "";
    resp.forEach(el => {
      const checkboxForm = document.createElement("div");
      checkboxForm.className = "form-group form-group--checkbox";
      categoriesDiv.append(checkboxForm);
      const checkboxLabel = document.createElement("label");
      checkboxForm.append(checkboxLabel);
      const checkboxInput = document.createElement("input");
      checkboxInput.type = "checkbox";
      checkboxInput.name = "categories";
      checkboxInput.value = el.id;
      checkboxInput.dataset.name = el.name;
      checkboxLabel.append(checkboxInput);
      const span1 = document.createElement("span");
      span1.className = "checkbox";
      checkboxLabel.append(span1);
      const span2 = document.createElement("span");
      span2.className = "description";
      span2.innerText = el.name;
      checkboxLabel.append(span2);
    });
  });
}

function displayInstitutions(institutions) {
  institutions.then(resp => {
    const institutionsDiv = document.querySelector("div[data-step='3'] div.organizations-container");
    institutionsDiv.innerHTML = "";
    resp.forEach(el => {
      const radioForm = document.createElement("div");
      radioForm.className = "form-group form-group--checkbox";
      institutionsDiv.append(radioForm);
      const radioLabel = document.createElement("label");
      radioForm.append(radioLabel);
      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "organization";
      radioInput.value = el.id;
      radioInput.dataset.type = el.type;
      radioInput.dataset.name = el.name;
      radioLabel.append(radioInput);
      const span1 = document.createElement("span");
      span1.className = "checkbox radio";
      radioLabel.append(span1);
      const span2 = document.createElement("span");
      span2.className = "description";
      radioLabel.append(span2);
      const titleDiv = document.createElement("div");
      titleDiv.className = "title";
      if (el.type === 1) {
        titleDiv.innerText = `Fundacja "${el.name}"`;
      } else if(el.type === 2) {
        titleDiv.innerText = `Organizacja ${el.name}`;
      } else {
        titleDiv.innerText = `Lokalna zbiórka ${el.name}`;
      }
      span2.append(titleDiv);
      const subtitleDiv = document.createElement("div");
      subtitleDiv.className = "subtitle";
      subtitleDiv.innerText = el.description;
      span2.append(subtitleDiv);

    })
  })
}

function getSelectedCategories() {
  const categoriesDiv = document.querySelector("div[data-step='1'] div.checkbox-container");
  const categoriesInput = categoriesDiv.querySelectorAll("input");
  let categories = {};
  for (const el of categoriesInput) {
    if (el.checked) {
     categories[el.value] = el.dataset.name;
    }
  }
  return categories;
}

function getInputs() {
  const selectedCategories = getSelectedCategories();
  const selectedInstitution = document.querySelector("div[data-step='3'] input:checked");
  const bagsQuantity = document.querySelector("input[name=bags]");
  const address = document.querySelector("input[name=address]");
  const city = document.querySelector("input[name=city]");
  const postcode = document.querySelector("input[name=postcode]");
  const phone = document.querySelector("input[name=phone]");
  const pickUpDate = document.querySelector("input[name=data]");
  const pickUpTime = document.querySelector("input[name=time]");
  const moreInfo = document.querySelector("textarea[name=more_info]");
  const data = {}
  data.selectedCategories = selectedCategories;
  data.selectedInstitution = selectedInstitution;
  data.bagsQuantity = bagsQuantity;
  data.address = address;
  data.city = city;
  data.postcode = postcode;
  data.phone = phone;
  data.pickUpDate = pickUpDate;
  data.pickUpTime = pickUpTime;
  data.moreInfo = moreInfo;
  return data;
}

function displaySummary(data) {
  const firstSection = document.querySelector("div.summary div.form-section");
  const spans = firstSection.querySelectorAll("span.summary--text");
  let bagsQuantityWord = ""
  if (data.bagsQuantity.value === 1) {
    bagsQuantityWord = "worek";
  } else if (data.bagsQuantity.value > 1 && data.bagsQuantity.value < 5) {
    bagsQuantityWord = "worki";
  } else {
    bagsQuantityWord = "worków";
  }
  let categories = []
  for (const el in data.selectedCategories) {
    categories.push(data.selectedCategories[el]);
  }
  spans[0].innerHTML = `${data.bagsQuantity.value} ${bagsQuantityWord} ${categories.join(", ")}`;
  let organizationType = "";
  if (data.selectedInstitution.dataset.type === "1") {
    organizationType = "fundacji";
  } else if (data.selectedInstitution.dataset.type === "2") {
    organizationType = "organizacji";
  } else {
    organizationType = "lokalnej zbiórki";
  }

  spans[1].innerHTML = `Dla ${organizationType} "${data.selectedInstitution.dataset.name}"`;

  const secondSectionColumns = document.querySelectorAll("div.summary div.form-section--column");
  const firstUl = secondSectionColumns[0].querySelector("ul");
  firstUl.innerHTML = "";
  for (const key of [data.address, data.city, data.postcode, data.phone]) {
    const li = document.createElement("li");
    li.innerText = key.value;
    firstUl.append(li);
  }

  const secondUl = secondSectionColumns[1].querySelector("ul");
  secondUl.innerHTML = "";
  for (const key of [data.pickUpDate, data.pickUpTime, data.moreInfo]) {
    const li = document.createElement("li");
    if (key === data.moreInfo && key.value === "") {
      li.innerText = "Brak Uwag";
    } else {
      li.innerText = key.value;
    }
    secondUl.append(li);
  }
}


function sendDonationData(data) {
  let categories = []
  for (const key in data.selectedCategories) {
    categories.push(key)
  }
  let phone = ""
  for (const el of data.phone.value) {
    if (el !== " ") {
      phone += el;
    }
  }
  let comment = ""
  if (data.moreInfo.value === "") {
    comment = "Brak Uwag";
  } else {
    comment = data.moreInfo.value;
  }

  let preparedData = {
    quantity: data.bagsQuantity.value,
    address: data.address.value,
    phone_number: phone,
    city: data.city.value,
    zip_code: data.postcode.value,
    pick_up_date: data.pickUpDate.value,
    pick_up_time: data.pickUpTime.value,
    pick_up_comment: comment,
    institution: data.selectedInstitution.value,
    categories: categories,
    user: JSON.parse(document.querySelector("#user_id").textContent)
  }

  return fetch(
      "/api/donations/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": `${document.querySelector("input[name=csrfmiddlewaretoken]").value}`
        },
        body: JSON.stringify(preparedData)
      }
  );
}
