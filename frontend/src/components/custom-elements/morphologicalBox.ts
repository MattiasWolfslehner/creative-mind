import { html, render } from "lit-html"
import { distinctUntilChanged, map } from "rxjs";
import { store } from "../../model/store"
import { Room } from "src/model";
import { Participation } from "src/model/participation";

class MorphologicalBox extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

}