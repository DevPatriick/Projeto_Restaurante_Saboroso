class HcodeGrid {
    constructor(configs) {
      this.options = Object.assign(
        {},
        {
          formCreate: "#modal-create form",
          formUpdate: "#modal-update form",
          btnUpdate: ".btn-update",
          btnDelete: ".btn-delete",
        },
        configs
      );
  
      this.formUpdate = document.querySelector(this.options.formUpdate);
  
      this.initForms();
      this.initButtons();
    }
  
    fireEvent(name, args) {
      if (typeof this.options.listeners[name] === 'function') {
        this.options.listeners[name].apply(this, args);
      } else {
        console.warn(`Listener '${name}' não encontrado.`);
      }
    }
  
    initForms() {
      this.formCreate = document.querySelector(this.options.formCreate);
  
      this.formCreate
        .save()
        .then((json) => {
          console.log(json);
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
  
      this.formUpdate = document.querySelector(this.options.formUpdate);
  
      this.formUpdate
        .save()
        .then((json) => {
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  
    initButtons() {
      [...document.querySelectorAll(this.options.btnUpdate)].forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.fireEvent('beforeUpdateClick', [e]);
          let tr = e.composedPath().find((el) => {
            return el.tagName.toUpperCase() === "TR";
          });
  
          
          let data = JSON.parse(tr.dataset.row);
  
          for (let name in data) {
            
            this.options.listeners.onUpdateLoad(this.formUpdate, name, data);
            
          }
        });

        
      });
  
      [...document.querySelectorAll(this.options.btnDelete)].forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.fireEvent('afterUpdateClick', [e]);
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
                this.fireEvent('afterDeleteClick', [e]);
              });
          });
        });
      });
    }
  }
  
  