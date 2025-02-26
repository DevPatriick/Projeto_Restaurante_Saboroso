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

  fireEvent(name, args){
    if(typeof this.options.listerners[name] === 'function') this.options.listerners[name].apply(this, args)

  }

  initForms() {
    this.formCreate = document.querySelector(this.options.formCreate);

    this.formCreate
      .save()
      .then((json) => {
        console.log(json);
        console.log(JSON.stringify(json));
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
        this.fireEvent('beforeUpdateClick', e)
        let tr = e.composedPath().find((el) => {
          return el.tagName.toUpperCase() === "TR";
        });

        console.log(tr);
        let data = JSON.parse(tr.dataset.row);
        console.log(data);

        for (let name in data) {
          let input = this.formUpdate.querySelector(`[name=${name}]`);
          switch (name) {
            case "date":
              if (input) input.value = moment(data[name]).format("YYYY-MM-DD");
              break;
            case "photo":
              this.formUpdate.querySelector("img").src = "/" + data[name];
              break;
            default:
              if (input) input.value = data[name];
          }
        }
        // $("#modal-update").modal("show");
      });
    });

    [...document.querySelectorAll(this.options.btnDelete)].forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.fireEvent('afterUpdateClick', e)
        let tr = e.composedPath().find((el) => {
          return el.tagName.toUpperCase() === "TR";
        });

        const confirmDelete = document.getElementById("confirmDelete");
        confirmDelete.style.display = "block";

        const deleteMenu = document.getElementById("confirmYes");

        console.log(tr);
        let data = JSON.parse(tr.dataset.row);
        console.log(data);

        const notConfirm = document.getElementById("confirmNo");

        const confirmMessage = confirmDelete.querySelector("p");
        confirmMessage.textContent = eval(
          "`" + this.options.deleteMessage + "`"
        );

        notConfirm.addEventListener("click", (e) => {
          confirmDelete.style.display = "none";
          window.location.reload();
        });

        deleteMenu.addEventListener("click", (e) => {
          // let msg = `Você realmente quer excluir o menu ${data.name} `
          fetch(eval("`" + this.options.deleteURL + "`"), {
            method: "DELETE",
          })
            .then((response) => {
              response.json();
            })
            .then((json) => {
              console.log(json);
              confirmDelete.style.display = "none";
              window.location.reload();
              // window.location.reload();
            });
        });
      });
    });
  }
}
