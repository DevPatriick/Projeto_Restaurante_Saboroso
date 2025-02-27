

class HcodeFileReader {
  constructor(inputEl, imgEl) {
    this.inputEl = inputEl;
    this.imgEl = imgEl;

    this.initInputElement();
  }

  initInputElement() {
    document.querySelector(this.inputEl).addEventListener("change", (e) => {
      console.log('Arquivo selecionado:', e.target.files[0]); 
      if (e.target.files.length > 0) {
        this.reader(e.target.files[0]).then(result => {
          console.log('Resultado do reader:', result); 
          const imgElement = document.querySelector(this.imgEl);
          if (imgElement) {
            imgElement.src = result;
          }
        }).catch(err => {
          console.error('Erro ao ler a imagem:', err);
        });
      }
    });
  }
  reader(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = function () {

        resolve(reader.result)
      };

      reader.onerror = function(){
        reject('Não foi possivel ler a imagem')
      }

      reader.readAsDataURL(file);
    });
  }
}
