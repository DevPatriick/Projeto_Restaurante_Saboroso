class HcodeGrid {
  
  constructor(configs) {
    this.options = Object.assign(
      {},
      {
        formCreate: "#modal-create form",
        formUpdate: "#modal-update form",
        btnUpdate: "btn-update",
        btnDelete: "btn-delete",
      },
      configs
    );

    this.rows = [...document.querySelectorAll("table tbody tr")];

    this.formUpdate = document.querySelector(this.options.formUpdate);

    this.initForms();
    this.initButtons();
  }

  fireEvent(name, args) {
    if (typeof this.options.listeners[name] === "function") {
      this.options.listeners[name].apply(this, args);
    } else {
      console.warn(`Listener '${name}' não encontrado.`);
    }
  }

  getTrData(e) {
    let tr = e.composedPath().find((el) => {
      return el.tagName.toUpperCase() === "TR";
    });

    return JSON.parse(tr.dataset.row);
  }

  initForms() {
    this.formCreate = document.querySelector(this.options.formCreate);

    if(this.formCreate){
      this.formCreate
      .save({
        success: ()=>{
          this.fireEvent('afterFormCreate')
        },
        failure: ()=>{
          this.fireEvent('afterFormCreateError')
        }
      })
    }

   
      

    this.formUpdate = document.querySelector(this.options.formUpdate);

    if(this.formUpdate){
      this.formUpdate
      .save({
        success: ()=>{
          this.fireEvent('afterFormUpdate')
        },
        failure: ()=>{
          this.fireEvent('afterFormUpdateError')
        }
      })
    }

    
      
  }

  btnUpdateClick(e) {
    this.fireEvent("beforeUpdateClick", [e]);
    let tr = e.composedPath().find((el) => {
      return el.tagName.toUpperCase() === "TR";
    });

    let data = JSON.parse(tr.dataset.row);

    for (let name in data) {
      this.options.listeners.onUpdateLoad(this.formUpdate, name, data);
    }
  }

  btnDeleteClick(e) {
    this.fireEvent("afterUpdateClick", [e]);
    let tr = e.composedPath().find((el) => {
      return el.tagName.toUpperCase() === "TR";
    });

    const confirmDelete = document.getElementById("confirmDelete");
    confirmDelete.style.display = "block";

    const deleteMenu = document.getElementById("confirmYes");

    let data = JSON.parse(tr.dataset.row);

    const notConfirm = document.getElementById("confirmNo");

    const confirmMessage = confirmDelete.querySelector("p");
    confirmMessage.textContent = eval("`" + this.options.deleteMessage + "`");

    notConfirm.addEventListener("click", () => {
      confirmDelete.style.display = "none";
      window.location.reload();
    });

    deleteMenu.addEventListener("click", () => {
      fetch(eval("`" + this.options.deleteURL + "`"), {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((json) => {
          confirmDelete.style.display = "none";
          this.fireEvent("afterDeleteClick", [e]);
        });
    });
  }

  initButtons() {
    this.rows.forEach((row) => {
      [...row.querySelectorAll(".btn")].forEach((btn) => {
        btn.addEventListener("click", (e) => {
          if (e.target.classList.contains(this.options.btnUpdate)) {
            this.btnUpdateClick(e); 
          } else if (e.target.classList.contains(this.options.btnDelete)) {
            this.btnDeleteClick(e); 
          } else {
            this.fireEvent("buttonClick", [e.target, this.getTrData(e), e]);
          }
        });
        
      });
    });
  }
}
