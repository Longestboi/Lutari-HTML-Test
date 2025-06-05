class ImageSelector extends HTMLElement {
  static observedAttributes = ["default", "selected"];
  constructor() {
    super();

    this.default_selection_int = this.attributes["default"]
      ? this.attributes["default"].nodeValue
      : 0;
    this.current_selection_int = this.attributes["selected"]
      ? this.attributes["selected"].nodeValue
      : this.default_selection_int;

    this.initialized = false;
    this.attachShadow({ mode: "open" });

    this.onmouseout = this.close;
    this.selectionchange = new CustomEvent("selection-changed");
  }

  get selected() {
    return this.current_selection_int;
  }

  set selected(index) {
    if (typeof index === "number") {
      if (index % 1 === 0) {
        this.setAttribute("selected", index);
      }
    }
  }

  toggleDropdown() {}

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "selected":
        this.current_selection_int =
          newValue < this.getOptions().length ? newValue : oldValue;
        break;
    }
    if (this.initialized) this.rerender();
  }

  getOptions() {
    return this.getElementsByTagName("selection");
  }

  rerender() {
    let bkg_image =
      this.getOptions()[this.current_selection_int].getAttribute("img");

    if (bkg_image !== null) {
      bkg_image = `url(${bkg_image})`;
    } else {
      bkg_image = "none";
    }

    this.image_displayer
      .getElementsByClassName("image_displayer")[0]
      .style.setProperty("--displayer-image", bkg_image);
  }

  open() {
    this.style.setProperty("--show-dropdown", "block");
    this.rerender();
  }

  close() {
    this.style.setProperty("--show-dropdown", "none");
    this.rerender();
  }

  connectedCallback() {
    if (!this.initialized) {
      const style_sheet = new CSSStyleSheet();
      style_sheet.replaceSync(`
        :host {
          --image-width: 32px;
          --image-height: 32px;

          --margin: .1em;
          --displayer-image: url();

          --show-dropdown: none;
        }

        .image_displayer {
          width: var(--image-width);
          height: var(--image-height);
          background-size: 100% 100%;
          margin: var(--margin);
          background-image: var(--displayer-image);
        }

        .image-selector-displayer {
          border: 1px solid grey;
          border-radius: 5px;
        }

        div#dropdown.image-selector-dropdown {
          position: absolute;
          background-color: white;
          border: 1px solid grey;
          border-radius: 5px;
          height: calc((var(--image-height) + (var(--margin) * 1.5)) * 2);
          overflow: scroll;
          display: var(--show-dropdown);
        }

        div#dropdown.image-selector-dropdown div.image_displayer:hover,
        div#image.image-selector-displayer div.image_displayer:hover {
          background-color: darkgrey;
          border-radius: 5px;
        }
      `);

      const wrapper = `
        <div>
          <div id="image" class="image-selector-displayer" onclick="this.getRootNode().host.open()"><div class="image_displayer"></div></div>
          <div id="dropdown" class="image-selector-dropdown"></div>
        </div>
      `;
      this.shadowRoot.innerHTML = wrapper;

      this.shadowRoot.adoptedStyleSheets = [style_sheet];

      this.image_displayer = this.shadowRoot.getElementById("image");
      this.dropdown = this.shadowRoot.getElementById("dropdown");

      // This should probably be done in this.rerender to allow selection items to be added after instanciation
      for (let i = 0; i < this.getOptions().length; i++) {
        let elem = this.getOptions()[i];
        let img = elem.getAttribute("img");

        let d_elem = document.createElement("div");
        d_elem.className = "image_displayer";
        if (img !== null) {
          d_elem.style.setProperty("--displayer-image", `url(${img})`);
        }
        // d_elem.onclick = ;
        this.dropdown.appendChild(d_elem);
        d_elem.onclick = (x) => {
          console.log(x);
          let host = d_elem.getRootNode().host;
          host.selected = i;
          this.dispatchEvent(this.selectionchange);
          host.close();
        };
      }

      this.initialized = true;
    }

    this.rerender();
  }

  updateTalisman() {}
}

customElements.define("image-selector", ImageSelector);
